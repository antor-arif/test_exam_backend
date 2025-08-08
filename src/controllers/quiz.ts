import { Request, Response } from "express";
import Question, { IQuestionDoc } from "../models/question";
import Result from "../models/result";
import { calculateScoreForStep } from "../utils/scoring";
import { generateCertificatePDF } from "../services/pdf";
import { sendCertificateEmail } from "../services/mail";
import mongoose from "mongoose";


const STEP_LEVELS: Record<number, string[]> = {
  1: ["A1", "A2"],
  2: ["B1", "B2"],
  3: ["C1", "C2"]
};

export const getQuestionsForStep = async (req: Request, res: Response) => {
  const step = Number(req.params.step);
  if (![1, 2, 3].includes(step)) return res.status(400).json({ message: "Invalid step" });

  const levels = STEP_LEVELS[step];

  const pipeline = [
    { $match: { level: { $in: levels } } },
    { $sample: { size: 44 } },
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
  const { step } = req.params;
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
    levelAwarded: scoreResult.levelAwarded
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
