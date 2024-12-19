import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import {
  EMAIL_SERVICE,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SENDER,
} from "./constants.js";

export async function sendEmail({
  to,
  subject,
  text,
  html = "",
  name = EMAIL_SENDER,
  from = process.env.FROM_EMAIL,
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      auth: {
        users: process.env.FROM_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `${name} <${from}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    throw new Error("Failed to send email. " + error.message);
  }
}

export function generateAccessToken(uId, expiresIn = "1h") {
  return jwt.sign({ uId }, process?.env?.JWT_KEY, {
    expiresIn,
  });
}

export function sendAccountActivationEmail(users, subject, text) {
  const { email, name, _id } = users;
  return sendEmail({
    to: email,
    subject: subject || "Your ToDo Account Activation",
    text:
      text ||
      `
            Welcome ${name}!
            Thank you for signup
            Please click on the bewlo link to activate your account. 
            Link: ${
              process.env.SERVER_HOST_URL
            }/api/v1/users/activate/${generateAccessToken(_id)}  
        `,
  });
}

export function getProfilePicUrl(req, picurl) {
  const protocol = req.protocol || "http"; // Default to 'http' if not set
  const host = req.get("host");
  return `${protocol}://${host}/${picurl}`;
}
