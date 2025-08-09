import { Router } from "express";
import { createQuestion, updateQuestion, deleteQuestion, listUsers, createQuiz , getQuiz, getAllQuizzes, updateQuiz, deleteQuiz, getQuestionsByQuizId, getAllCertificates} from "../controllers/admin";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorize("admin"));

router.post("/:quizId/questions", createQuestion);
router.put("/:quizId/questions/:id", updateQuestion);
router.delete("/:quizId/questions/:id", deleteQuestion);
router.get("/users", listUsers);
router.post("/create-quiz", createQuiz);
router.get("/quiz/:id", getQuiz);
router.get("/quizzes", getAllQuizzes);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);
router.get("/quiz/:quizId/questions", getQuestionsByQuizId);
router.get("/certificates", getAllCertificates);

export default router;
