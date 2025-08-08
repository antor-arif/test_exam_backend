# Test_School Backend

Backend for Test_School competency assessment.

## Features implemented
- Auth: register (OTP), verify OTP, login (JWT access + refresh), forgot/reset password
- Role-based routes (admin/student/supervisor)
- 3-step quiz endpoints: fetch 44 questions per step, submit answers, scoring logic
- PDF certificate generation and email sending (attachment)
- Admin CRUD for questions and user listing with pagination
- Seed script to create 132 questions (22 competencies × 6 levels)

## Environment
Copy `.env.example` to `.env` and fill in values.

## Scripts
```bash
# install
npm install

# dev
npm run dev

# build
npm run build
npm start

# seed questions
npm run seed
