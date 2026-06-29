import express from "express";
import analyzeController from "../controllers/analyzeController.js";

const router = express.Router();

router.post("/analyze", analyzeController.analyze);

export default router;