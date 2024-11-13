import nodemailer from "nodemailer";
import { generateSigninEmailHtml } from "./generateSigninEmailHtml.js";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
});

const sendSigninMail = (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Successful Sign-in to FashionFlick`,
    html: generateSigninEmailHtml(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending sign-in email:", error);
      return;
    }
    console.log("Sign-in email sent:", info.response);
  });
};

export default sendSigninMail;
