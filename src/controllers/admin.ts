import { Request, Response } from "express";
import User from "../models/user";
import Question from "../models/question";



export const createQuestion = async (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload.text || !payload.options || !payload.correctKey || !payload.level || !payload.competency)
    return res.status(400).json({ message: "Missing fields" });

  const q = await Question.create(payload);
  res.status(201).json(q);
};

export const updateQuestion = async (req: Request, res: Response) => {
  const id = req.params.id;
  const q = await Question.findByIdAndUpdate(id, req.body, { new: true });
  if (!q) return res.status(404).json({ message: "Not found" });
  res.json(q);
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const id = req.params.id;
  await Question.findByIdAndDelete(id);
  res.json({ message: "Deleted" });
};

export const listUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([User.find().skip(skip).limit(limit).select("-password"), User.countDocuments()]);
  res.json({
    data: users,
    meta: { page, limit, totalPages: Math.ceil(total / limit), total }
  });
};
