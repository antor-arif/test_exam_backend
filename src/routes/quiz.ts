import { Router } from "express";
import { getQuestionsForStep, submitAnswers, getUserCertificates, downloadCertificate, getQuiz } from "../controllers/quiz";
import { authenticate } from "../middleware/auth";
import { getAllQuizzes } from "../controllers/admin";

const router = Router();


router.get("/:quizId/step/:step/questions", authenticate, getQuestionsForStep);
router.post("/:quizId/step/:step/submit", authenticate, submitAnswers);
router.get("/quizzes", authenticate, getAllQuizzes);
router.get("/quizzes/:quizId", authenticate, getQuiz);

router.get("/certificates", authenticate, getUserCertificates);
router.get("/certificates/:resultId/download", authenticate, downloadCertificate);

export default router;
