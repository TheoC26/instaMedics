import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

function formatFormData(data: any): string {
  let formatted = "";
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      formatted += `${key}:\n${formatFormData(value)}\n`;
    } else {
      formatted += `${key}: ${value}\n`;
    }
  }
  return formatted;
}

export async function POST(req: Request) {
  const formData = await req.json();

  const instamedicsMailOptions = {
    from: process.env.EMAIL_USER,
    to: "info@insta-medics.com",
    subject: "New Service Request",
    text: formatFormData(formData),
  };

  const clientMailOptions = {
    from: process.env.EMAIL_USER,
    to: formData.requestorInfo.email,
    cc: "info@insta-medics.com",
    subject: "Service Request Received",
    html: `
      <h1>Service Request Received</h1>
      <p>Your request has been received and is being reviewed.</p>
      <h2>Details you provided:</h2>
      <pre>${formatFormData(formData)}</pre>
      <p>Thank you for choosing Instamedics!</p>
    `,
  };

  try {
    // await transporter.sendMail(instamedicsMailOptions);
    await transporter.sendMail(clientMailOptions);
    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
