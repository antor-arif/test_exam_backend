import user from "../models/user";

export type Role = "admin" | "student" | "supervisor";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  createdAt?: Date;
}

export interface IQuestion {
  competency: string;
  level: string; 
  text: string;
  options: { key: string; text: string }[];
  correctKey: string;
}

export interface IResult {
  user: string;
  step: number;
  score: number;
  levelAwarded: string;
  createdAt?: Date;
}


declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}