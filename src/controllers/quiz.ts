import { Request, Response } from "express";
import Question, { IQuestionDoc } from "../models/question";
import Result from "../models/result";
import { calculateScoreForStep } from "../utils/scoring";
import { generateCertificatePDF } from "../services/pdf";
import { sendCertificateEmail } from "../services/mail";
import mongoose from "mongoose";
import { PipelineStage } from "mongoose";
import quiz from "../models/quiz";


const STEP_LEVELS: Record<number, string[]> = {
  1: ["A1", "A2"],
  2: ["B1", "B2"],
  3: ["C1", "C2"]
};

export const getQuestionsForStep = async (req: Request, res: Response) => {
  const step = Number(req.params.step);
  const quizId = req.params.quizId;
  if (![1, 2, 3].includes(step)) return res.status(400).json({ message: "Invalid step" });

  const levels = STEP_LEVELS[step];

  const pipeline: PipelineStage[] = [
    { $match: { level: { $in: levels }, quizId: new mongoose.Types.ObjectId(quizId) } },
    { $sample: { size: 44 } },
    {
      $sort: {
        level: 1 as 1 
      }
    },
    {
      $project: {
        competency: 1,
        level: 1,
        text: 1,
        options: 1
      }
    }
  ];
  const questions = await Question.aggregate(pipeline);
  res.json({ questions, total: questions.length, levels });
};

export const submitAnswers = async (req: Request, res: Response) => {
  const user = req?.user;
  const { step, quizId } = req.params;
  const stepNum = Number(step);
  const answers: { questionId: string; selectedKey: string }[] = req.body.answers;

  if (!answers || !Array.isArray(answers) || answers.length === 0)
    return res.status(400).json({ message: "Missing answers" });

  const qIds = answers.map((a) => new mongoose.Types.ObjectId(a.questionId));
  const questions = await Question.find({ _id: { $in: qIds } });

  const map = new Map<string, string>();
  for (const q of questions) {
    if (q && q._id && q.correctKey) {
      map.set(q._id.toString(), q.correctKey);
    }
  }
  
  let correct = 0;
  answers.forEach((a) => {
    const correctKey = map.get(a.questionId);
    if (correctKey && correctKey === a.selectedKey) correct++;
  });

  const scoreResult = calculateScoreForStep(stepNum, correct, answers?.length || 44);


  const result = await Result.create({
    user: user._id,
    step: stepNum,
    score: scoreResult.percentage,
    levelAwarded: scoreResult.levelAwarded,
    quizId: new mongoose.Types.ObjectId(quizId)
  });

  let certificateBuffer: Buffer | null = null;
  const shouldGenerateCertificate = scoreResult.levelAwarded !== "Fail" && scoreResult.levelAwarded !== "Unknown";

  if (shouldGenerateCertificate) {
    certificateBuffer = await generateCertificatePDF(user.name, scoreResult.levelAwarded);
    try {
      await sendCertificateEmail(user.email, certificateBuffer, `certificate_${user._id}.pdf`);
    } catch (err) {
      console.warn("send certificate email failed", err);
    }
  }

  res.json({
    result,
    proceed: scoreResult.proceed,
    certificateSent: !!certificateBuffer,
    certificateUrl: null 
  });
};

export const getUserCertificates = async (req: Request, res: Response) => {
  const user = req?.user;
  
  try {
   
    const results = await Result.find({
      user: user._id,
      levelAwarded: { $nin: ["Fail", "Unknown"] }
    }).populate('quizId', 'name niche');
    
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No certificates found for this user"
      });
    }
    
   
    const certificates = results.map(result => ({
      id: result._id,
      quizId: result.quizId,
      quizName: result.quizId ? (result.quizId as any).name : 'General Assessment',
      level: result.levelAwarded,
      score: result.score,
      date: result.createdAt,
      step: result.step
    }));
    
    res.status(200).json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const downloadCertificate = async (req: Request, res: Response) => {
  const user = req?.user;
  const { resultId } = req.params;
  
  try {
    
    const result = await Result.findOne({
      _id: resultId,
      user: user._id
    });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }
    
    if (result.levelAwarded === "Fail" || result.levelAwarded === "Unknown") {
      return res.status(400).json({
        success: false,
        message: "No certificate available for failed assessments"
      });
    }
    
    const certificateBuffer = await generateCertificatePDF(user.name, result.levelAwarded);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${user._id}_${result._id}.pdf`);
    
    res.send(certificateBuffer);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const findQuiz = await quiz.findById(quizId);
    if (!findQuiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, data: findQuiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
