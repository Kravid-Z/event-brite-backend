import express from "express";
import { sendEmail } from "./email-service-sendEmail.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    await sendEmail("test@email.com");
    res.send("Email sent!");
  } catch (error) {
    next(error);
  }
});

export default router;
