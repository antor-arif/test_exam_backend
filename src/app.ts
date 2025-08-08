import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";
import authRoutes from "./routes/auth";
import quizRoutes from "./routes/quiz";
import adminRoutes from "./routes/admin";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_, res) => {
  res.json({ message: "Test_School Backend" });
});

app.use(errorHandler);

export default app;
