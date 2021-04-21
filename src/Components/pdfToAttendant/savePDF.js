import express from "express";
import { generatePdf } from "./pdf-service-savePDF.js";

const router = express.Router();

router.get("/exportPDF", async (req, res, next) => {
  try {
    await generatePdf({});
    res.send("PDF Generated");
  } catch (error) {
    next(error);
  }
});

export default router;
