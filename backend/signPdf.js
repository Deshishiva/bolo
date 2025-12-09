import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";

import { generateHash } from "../utils/hash.js";
import { convertToPdfCoords } from "../utils/pdf.js";
import { fitImage } from "../utils/fitImage.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/sign-pdf", async (req, res) => {
  try {
    const { coordinates, signatureBase64 } = req.body;

    const pdfPath = path.join(__dirname, "..", "sample.pdf");
    const pdfBytes = fs.readFileSync(pdfPath);

    const beforeHash = generateHash(pdfBytes);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(0);
    const { width: pageW, height: pageH } = page.getSize();

    const box = convertToPdfCoords(coordinates, pageW, pageH);

    const imageBytes = Buffer.from(
      signatureBase64.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    const image = await pdfDoc.embedPng(imageBytes);

    const fitted = fitImage(
      image.width,
      image.height,
      box.width,
      box.height
    );

    const x = box.x + (box.width - fitted.width) / 2;
    const y = box.y + (box.height - fitted.height) / 2;

    page.drawImage(image, {
      x,
      y,
      width: fitted.width,
      height: fitted.height
    });

    const signedPdf = await pdfDoc.save();
    const afterHash = generateHash(signedPdf);

    const uploadDir = path.join("uploads", "signed-pdfs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const outputPath = path.join(
      uploadDir,
      `signed-${Date.now()}.pdf`
    );

    fs.writeFileSync(outputPath, signedPdf);

    res.json({
      success: true,
      url: outputPath,
      beforeHash,
      afterHash
    });
  } catch (err) {
    console.error("PDF SIGN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

