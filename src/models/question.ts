import mongoose, { Schema, Document } from "mongoose";

export interface IOption {
  key: string;
  text: string;
}

export interface IQuestionDoc extends Document {
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
    competency: { type: String, required: true },
    level: { type: String, required: true },
    text: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    correctKey: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IQuestionDoc>("Question", QuestionSchema);
