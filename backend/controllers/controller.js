import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

export const Encode = async (req, res) => {
  console.log("We got the encode sir");
  console.log(req.body.st, req.body.email, req.body.senderEmail);

  //   return res.status(200).json({ msg: "Encode API worked! Bingo!!" });

  if (!req.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  // Set headers for downloading the image
  res.setHeader("Content-Type", req.file.mimetype);
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="encoded_image.jpg"'
  );

  // Send the image back to the frontend
  return res.status(200).send(req.file.buffer);
};

export const Decode = async (request, response) => {};

export const Destroy = async (request, response) => {};

export const mailReciever = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  if (!req.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Encoded Secret Image",
    html: `
      <p>Dear,</p>
      <p>I hope you're doing well!</p>
      <p>As per our previous discussion, I’m sharing with you a securely encoded image containing a secret message. Please find the image attached.</p>
      <p>Best regards,<br/>Secret Frame</p>
    `,
    attachments: [
      {
        filename: "encoded_image.jpg", // The name of the file that will appear in the email
        content: req.file.buffer, // Raw image buffer from multer
        contentType: req.file.mimetype, // Dynamically setting MIME type (e.g., image/jpeg or image/png)
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ msg: "Failed to send email" });
    }
    res.status(200).json({ msg: "Email sent successfully", info });
  });
};
