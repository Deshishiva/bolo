import express from "express";
import cors from "cors";
import signPdfRoute from "./routes/signPdf.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));


app.use("/uploads", express.static("uploads"));

app.use("/api", signPdfRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
