import mongoose, { Schema, Document } from "mongoose";

export interface IResultDoc extends Document {
  user: mongoose.Types.ObjectId | string;
  step: number;
  score: number;
  levelAwarded: string;
}

const ResultSchema = new Schema<IResultDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    step: { type: Number, required: true },
    score: { type: Number, required: true },
    levelAwarded: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IResultDoc>("Result", ResultSchema);
