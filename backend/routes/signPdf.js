const uploadDir = path.join("uploads", "signed-pdfs");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const outputPath = path.join(
  uploadDir,
  `signed-${Date.now()}.pdf`
);

fs.writeFileSync(outputPath, signedPdf);
