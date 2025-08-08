import { Router } from "express";
import { getQuestionsForStep, submitAnswers } from "../controllers/quiz";
import { authenticate } from "../middleware/auth";

const router = Router();


router.get("/step/:step/questions", authenticate, getQuestionsForStep);
router.post("/step/:step/submit", authenticate, submitAnswers);

export default router;
