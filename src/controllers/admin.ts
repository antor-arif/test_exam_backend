import { Request, Response } from "express";
import User from "../models/user";
import Question from "../models/question";
import quiz from "../models/quiz";



export const createQuestion = async (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload.text || !payload.options || !payload.correctKey || !payload.level || !payload.competency || !payload.quizId)
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

  const [users, total] = await Promise.all([User.find({role:{$ne:"admin"}}).skip(skip).limit(limit).select("-password"), User.countDocuments({role:{$ne:"admin"}})]);
  res.json({
    data: users,
    meta: { page, limit, totalPages: Math.ceil(total / limit), total }
  });
};


export const createQuiz = async (req: Request, res: Response) => {
  const { name, niche, totalQuestions } = req.body;

  if (!name || !niche || !totalQuestions) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newQuiz = await quiz.create({ name, niche, totalQuestions });
  res.status(201).json(newQuiz);
};

export const getQuiz = async (req: Request, res: Response) => {
  const id = req.params.id;
  const findQuiz = await quiz.findById(id);
  if (!findQuiz) return res.status(404).json({ message: "Not found" });
  res.status(200).json(findQuiz);
};

export const getAllQuizzes = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const quizzes = await quiz.find().skip((page - 1) * limit).limit(limit);
  const totalCount = await quiz.countDocuments();
  res.status(200).json({ quizzes, totalCount });
};

export const updateQuiz = async(req : Request, res: Response) => {
  const id = req.params.id;
  const { name, niche, totalQuestions } = req.body;

  const findQuiz = await quiz.findById(id);
  if (!findQuiz) return res.status(404).json({ message: "Not found" });

  findQuiz.name = name || findQuiz.name;
  findQuiz.niche = niche || findQuiz.niche;
  findQuiz.totalQuestions = totalQuestions || findQuiz.totalQuestions;

  await findQuiz.save();
  res.status(200).json(findQuiz);
}

export const deleteQuiz = async (req: Request, res: Response) => {
  const id = req.params.id;
  const findQuiz = await quiz.findById(id);
  if (!findQuiz) return res.status(404).json({ message: "Not found" });

  const deleteQuiz = await quiz.findByIdAndDelete(id);
  res.status(204).json(
    {
      message: "Deleted",
    }
  );
};
