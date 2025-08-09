import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOption {
  key: string;
  text: string;
}

export interface IQuestionDoc extends Document {
  quizId: Types.ObjectId;
  competency: string;
  level: string; 
  text: string;
  options: IOption[];
  correctKey: string;
}

const OptionSchema = new Schema(
  {
    key: { type: String, required: true },
    text: { type: String, required: true }
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestionDoc>(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    competency: { type: String, required: true },
    level: { type: String, required: true },
    text: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    correctKey: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IQuestionDoc>("Question", QuestionSchema);
