import { Router } from "express";
import { getQuestionsForStep, submitAnswers } from "../controllers/quiz";
import { authenticate } from "../middleware/auth";
import { getAllQuizzes } from "../controllers/admin";

const router = Router();


router.get("/:quizId/step/:step/questions", authenticate, getQuestionsForStep);
router.post("/:quizId/step/:step/submit", authenticate, submitAnswers);
router.get("/quizzes", authenticate, getAllQuizzes);


export default router;
