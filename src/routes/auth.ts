import { Router } from "express";
import { register, verifyOtp, login, forgotPassword, resetPassword } from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
