import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Question from "../models/question";

const COMPETENCIES = [
  "Digital Communication",
  "Online Safety",
  "Information Literacy",
  "Word Processing",
  "Spreadsheets",
  "Presentations",
  "Email Management",
  "Cloud Collaboration",
  "Digital Footprint",
  "Data Privacy",
  "Search & Research",
  "Device Management",
  "Media Literacy",
  "Online Transactions",
  "Coding Basics",
  "Problem Solving",
  "Project Management",
  "Digital Creativity",
  "Networking Basics",
  "OS Basics",
  "Accessibility",
  "Cyber Hygiene"
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

async function seed() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/test_school";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB for seeding");

  await Question.deleteMany({});
  console.log("Cleared existing questions");

  const created: any[] = [];

  for (const competency of COMPETENCIES) {
    for (const level of LEVELS) {
      const baseText = `${competency} - ${level}: Sample question about ${competency} at level ${level}.`;
      const options = [
        { key: "A", text: "Option A" },
        { key: "B", text: "Option B" },
        { key: "C", text: "Option C" },
        { key: "D", text: "Option D" }
      ];

      const correctKey = options[(Math.abs(hashCode(baseText)) % 4)].key;
      const q = await Question.create({
        competency,
        level,
        text: baseText,
        options,
        correctKey
      });
      created.push(q);
    }
  }

  console.log(`Seeded ${created.length} questions`);
  await mongoose.disconnect();
  process.exit(0);
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
