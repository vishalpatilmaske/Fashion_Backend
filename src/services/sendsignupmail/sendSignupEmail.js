import nodemailer from "nodemailer";
import { generateEmailHtml } from "./generateEmailHtml.js";
// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
});

const sendSignupMail = (email) => {
  const mailOptions = {
    from: "vishalpatilmaske@gmail.com",
    to: email,
    subject: `Welcome to FashionFlick!`,
    html: generateEmailHtml(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    }
  });
};

export default sendSignupMail;
