import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "student" | "supervisor";
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student", "supervisor"], default: "student" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUserDoc>("User", UserSchema);
