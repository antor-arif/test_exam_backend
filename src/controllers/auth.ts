import { Request, Response } from "express";
import User from "../models/user";
import { signAccessToken, signRefreshToken } from "../services/jwtService";
import crypto from "crypto";
import { sendOtpEmail } from "../services/mail";

const OTP_TTL_MIN = 10;

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const user = new User({ name, email, password, role: role || "student" });
  await user.save();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
  await user.save();
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.warn("OTP email failed", err);
  }

  res.status(201).json({ message: "Registered. Verify email with OTP sent." });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.json({ message: "Already verified" });

  if (!user.otp || !user.otpExpires) return res.status(400).json({ message: "No OTP requested" });

  if (user.otp !== otp || user.otpExpires < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Verified" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }

  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If user exists, OTP was sent" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
  await user.save();
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.warn("forgot password email failed", err);
  }
  res.json({ message: "If user exists, OTP was sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: "Missing fields" });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid request" });
  if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date())
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successful" });
};
