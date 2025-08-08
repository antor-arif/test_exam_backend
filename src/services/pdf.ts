import PDFDocument from "pdfkit";
import { Readable } from "stream";


export async function generateCertificatePDF(name: string, level: string): Promise<Buffer> {
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
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
    doc.end();
  });
}
