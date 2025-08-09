import mongoose, { Schema, Document } from "mongoose";

export interface IResultDoc extends Document {
  user: mongoose.Types.ObjectId | string;
  step: number;
  score: number;
  levelAwarded: string;
  quizId?: mongoose.Types.ObjectId | string;
  certificateUrl?: string;
  certificateId?: string;
  certificateHtml?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResultDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    step: { type: Number, required: true },
    score: { type: Number, required: true },
    levelAwarded: { type: String, required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    certificateUrl: { type: String },
    certificateId: { type: String },
    certificateHtml: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IResultDoc>("Result", ResultSchema);
