import { Router } from "express";
import { createQuestion, updateQuestion, deleteQuestion, listUsers, createQuiz , getQuiz, getAllQuizzes, updateQuiz, deleteQuiz} from "../controllers/admin";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorize("admin"));

router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.get("/users", listUsers);
router.post("/create-quiz", createQuiz);
router.get("/quiz/:id", getQuiz);
router.get("/quizzes", getAllQuizzes);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);

export default router;
