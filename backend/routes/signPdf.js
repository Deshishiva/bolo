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
