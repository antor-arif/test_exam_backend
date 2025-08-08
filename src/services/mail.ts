import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOtpEmail(email: string, otp: string) {
  const mail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Test_School OTP",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  };
  return transporter.sendMail(mail);
}

export async function sendCertificateEmail(email: string, pdfBuffer: Buffer, fileName = "certificate.pdf") {
  const mail = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Test_School Certificate",
    text: "Congratulations on completing the test. Your certificate is attached.",
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer
      }
    ]
  };
  return transporter.sendMail(mail);
}
