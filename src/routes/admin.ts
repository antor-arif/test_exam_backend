import { Router } from "express";
import { createQuestion, updateQuestion, deleteQuestion, listUsers } from "../controllers/admin";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorize(["admin"]));

router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

router.get("/users", listUsers);

export default router;
