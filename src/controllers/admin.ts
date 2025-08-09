import { Request, Response } from "express";
import User from "../models/user";
import Question from "../models/question";
import quiz from "../models/quiz";
import Result from "../models/result";



export const createQuestion = async (req: Request, res: Response) => {
  const quizId = req.params.quizId;
  const payload = req.body;

  if (!payload.text || !payload.options || payload.correctAnswerIndex === undefined || !payload.level || !payload.competency)
    return res.status(400).json({ message: "Missing fields" });

  const correctKey = payload.options[payload.correctAnswerIndex];

  const q = await Question.create({ ...payload, quizId: quizId, correctKey: correctKey?.key });
  res.status(201).json(q);
};

export const updateQuestion = async (req: Request, res: Response) => {
  const quizId = req.body.quizId;
  const id = req.params.id;
  const payload = req.body;
  const q = await Question.findOneAndUpdate({ _id: id, quizId }, { ...payload, correctKey: payload.options[payload.correctAnswerIndex] }, { new: true });
  if (!q) return res.status(404).json({ message: "Not found" });
  res.json(q);
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const quizId = req.body.quizId;
  const id = req.params.id;
  await Question.findOneAndDelete({ _id: id, quizId });
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
  const { name, niche, totalQuestions, description } = req.body;

  if (!name || !niche || !totalQuestions || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newQuiz = await quiz.create({ name, niche, totalQuestions, description });
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
  const { name, niche, totalQuestions, description } = req.body;

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

export const getAllCertificates = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  try {
    const [results, total] = await Promise.all([
      Result.find({ levelAwarded: { $nin: ["Fail", "Unknown"] } })
        .populate('user', 'name email')
        .populate('quizId', 'name niche')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Result.countDocuments({ levelAwarded: { $nin: ["Fail", "Unknown"] } })
    ]);
    
    const certificates = results.map(result => ({
      id: result._id,
      user: {
        id: (result.user as any)._id,
        name: (result.user as any).name,
        email: (result.user as any).email
      },
      quiz: result.quizId ? {
        id: (result.quizId as any)._id,
        name: (result.quizId as any).name,
        niche: (result.quizId as any).niche
      } : null,
      level: result.levelAwarded,
      score: result.score,
      date: result.createdAt,
      step: result.step
    }));
    
    res.status(200).json({
      success: true,
      data: certificates,
      meta: {
        page,
        limit,
        totalCertificates: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all certificates:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getQuestionsByQuizId = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const quizExists = await quiz.findById(quizId);
    if (!quizExists) {
      return res.status(404).json({ 
        success: false, 
        message: "Quiz not found"
      });
    }

    const [questions, total] = await Promise.all([
      Question.find({ quizId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('text competency level options correctKey'),
      Question.countDocuments({ quizId })
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      quiz: {
          _id: quizExists._id,
          name: quizExists.name,
          niche: quizExists.niche,
          totalQuestions: quizExists.totalQuestions
        },
      meta: {
        page,
        limit,
        totalQuestions: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching questions by quizId:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};