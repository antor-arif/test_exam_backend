import PDFDocument from "pdfkit";
import { Readable } from "stream";


export async function generateCertificatePDF(name: string, level: string, certificateId?: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc.fontSize(20).text("Test_School Certificate", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(14).text(`This is to certify that`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(24).text(`${name}`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).text(`has achieved competency level: ${level}`, { align: "center" });
    doc.moveDown(2);
    
    if (certificateId) {
      doc.fontSize(10).text(`Certificate ID: ${certificateId}`, { align: "center" });
      doc.moveDown(1);
    }
    
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
    doc.end();
  });
}

export function generateCertificateHtml(name: string, level: string, certificateId?: string): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Test_School Certificate</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          text-align: center;
          color: #333;
          border: 20px solid #f5f5f5;
          padding: 40px;
          margin: 0;
          background: #fff;
          position: relative;
        }
        .certificate-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 5px solid #gold;
          background-color: #fff;
        }
        .header {
          font-size: 28px;
          color: #3a3a3a;
          margin-bottom: 30px;
          font-weight: bold;
        }
        .intro {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .name {
          font-size: 32px;
          color: #1a73e8;
          margin: 20px 0;
          font-weight: bold;
        }
        .achievement {
          font-size: 22px;
          margin: 20px 0;
        }
        .certificate-id {
          font-size: 14px;
          margin-top: 40px;
          color: #777;
        }
        .date {
          font-size: 16px;
          margin-top: 30px;
          text-align: right;
        }
        .stamp {
          position: absolute;
          right: 80px;
          bottom: 120px;
          opacity: 0.5;
          transform: rotate(-15deg);
          font-size: 72px;
          color: rgba(255, 0, 0, 0.3);
          border: 5px solid rgba(255, 0, 0, 0.3);
          padding: 10px;
          border-radius: 10px;
        }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="header">Test_School Certificate</div>
        <div class="intro">This is to certify that</div>
        <div class="name">${name}</div>
        <div class="achievement">has achieved competency level: ${level}</div>
        ${certificateId ? `<div class="certificate-id">Certificate ID: ${certificateId}</div>` : ''}
        <div class="date">Date: ${currentDate}</div>
        <div class="stamp">CERTIFIED</div>
      </div>
    </body>
    </html>
  `;
}
