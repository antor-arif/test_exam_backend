import mongoose, { Schema, Document } from "mongoose";



export interface IQuizDoc extends Document {
  name: string;
  niche: string; 
  totalQuestions: string;
}


const QuizSchema = new Schema<IQuizDoc>({
  name: { type: String, required: true },
  niche: { type: String, required: true },
  totalQuestions: { type: String, required: true },
});

export default mongoose.model<IQuizDoc>("Quiz", QuizSchema);
