import { Router } from "express";
import { 
  getQuestionsForStep, 
  submitAnswers, 
  getUserCertificates, 
  downloadCertificate, 
  getQuiz, 
  getUserResults,
  viewCertificateHtml
} from "../controllers/quiz";
import { authenticate } from "../middleware/auth";
import { getAllQuizzes } from "../controllers/admin";

const router = Router();


router.get("/:quizId/step/:step/questions", authenticate, getQuestionsForStep);
router.post("/:quizId/step/:step/submit", authenticate, submitAnswers);
router.get("/quizzes", authenticate, getAllQuizzes);
router.get("/quizzes/:quizId", authenticate, getQuiz);

// Certificate routes
router.get("/certificates", authenticate, getUserCertificates);
router.get("/certificates/:resultId/download", authenticate, downloadCertificate);
router.get("/certificates/:certificateId/view", viewCertificateHtml); 
router.get("/results", authenticate, getUserResults);

export default router;
