import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Session from "../model/Session.js";
import { randomInt } from "crypto";
dotenv.config();

export const Encode = async (req, res) => {
  console.log("We got the encode sir");
  console.log(req.body.st, req.body.recieverEmail, req.body.senderEmail);
  const { st, recieverEmail, senderEmail } = req.body;
  //   return res.status(200).json({ msg: "Encode API worked! Bingo!!" });

  if (!req.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  //The game starts here
  //Encode
  //we will create hash using sender mail + reciever mail and store in image with the secret store in db
  //encrypt the text with the secret and store in image and send backto user

  //Decode
  //We will check the hash using the reciever and sender mail if there are more documents then we will have secret of all of them and check with the hash if the hash is matched
  //Then we will take that secret and decrypt the text and mailto urself and display.

  //Aditinally we will prompt sender to destroy this if he destries the will destroy from db

  const secretUUID = uuidv4();
  console.log(secretUUID);

  // Combine the emails with the UUID to create a unique string
  const combinedString = `${senderEmail}:${recieverEmail}:${secretUUID}`;

  // Generate a hash of the combined string (hashing the email + UUID secret)
  const hash = bcrypt.hashSync(combinedString, 12);

  const encryptedSecret = CryptoJS.AES.encrypt(
    secretUUID,
    process.env.MASTER_KEY
  ).toString();

  const encrypted = CryptoJS.AES.encrypt(st, secretUUID).toString();

  console.log(hash);
  console.log(encrypted);
  console.log(encryptedSecret);

  const sessionData = new Session({
    senderMail: senderEmail,
    randomNumber: encryptedSecret,
    recieverMail: recieverEmail,
  });

  const savedSession = await sessionData.save();
  console.log("Session saved successfully:", savedSession);

  // Set headers for downloading the image
  // res.setHeader("Content-Type", req.file.mimetype);
  // res.setHeader(
  //   "Content-Disposition",
  //   'attachment; filename="encoded_image.jpg"'
  // );

  // // Send the image back to the frontend
  // return res.status(200).send(req.file.buffer);

  // Prepare the data to be added to the image (can be base64 encoded, or as a string)
  const encodedData = JSON.stringify({
    hash: hash,

    encryptedText: encrypted,
  });

  // Use sharp to embed the data into the image
  sharp(req.file.buffer)
    .toBuffer()
    .then((imageBuffer) => {
      // Embed the encoded data by appending it to the end of the image as a comment
      const combinedBuffer = Buffer.concat([
        imageBuffer,
        Buffer.from(`\n<!-- ${encodedData} -->`), // Embed your custom data
      ]);

      // Set headers for downloading the image
      res.setHeader("Content-Type", req.file.mimetype);
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="encoded_image.jpg"'
      );

      // Send the combined buffer (image + data) back to the frontend
      return res.status(200).send(combinedBuffer);
    })
    .catch((err) => {
      console.error("Error processing the image:", err);
      return res.status(500).json({ msg: "Error processing the image" });
    });
};

export const Decode = async (req, res) => {
  console.log("Decoding process initiated...");

  const { recieverEmail } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  try {
    // Extract the custom encoded data from the image
    const imageBuffer = req.file.buffer.toString("utf-8");

    // Look for the embedded data (e.g., JSON string after the comment tag `<!--`)
    const encodedDataMatch = imageBuffer.match(/<!--\s*({.*})\s*-->/);
    // console.log("encodeed data", encodedDataMatch);
    if (!encodedDataMatch) {
      return res
        .status(400)
        .json({ msg: "No encoded data found in the image" });
    }

    const encodedData = JSON.parse(encodedDataMatch[1]);
    const { hash, encryptedText } = encodedData;
    let encryptedSecret = "";
    console.log(hash);
    console.log(encryptedText);
    // console.log(encryptedSecret);
    // Fetch all sessions for the receiver email from the database
    const sessions = await Session.find({ recieverMail: recieverEmail });
    console.log(sessions);

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: "No secrets found for this image" });
    }

    let validSession = null;

    // Decrypt the secret UUID using the master key
    let secretUUID;

    //  if (!secretUUID) {
    //    return res.status(400).json({ msg: "Failed to decrypt secret key" });
    //  }

    // Loop through all sessions and validate hash
    for (const session of sessions) {
      encryptedSecret = session.randomNumber;

      const randomNumberDecrypt = CryptoJS.AES.decrypt(
        encryptedSecret,
        process.env.MASTER_KEY
      ).toString(CryptoJS.enc.Utf8);

      console.log(randomNumberDecrypt);
      secretUUID = randomNumberDecrypt;

      const combinedString = `${session.senderMail}:${session.recieverMail}:${secretUUID}`;

      // const combinedStringHash = bcrypt.hashSync(combinedString, 12);
      // Compare the plain combined string against the saved hash

      console.log(combinedString);
      if (bcrypt.compareSync(combinedString, hash)) {
        console.log(true);
        validSession = session;

        break;
      }
    }

    console.log("valid session : ", validSession);

    if (!validSession) {
      return res.status(400).json({ msg: "No secrets found for this image" });
    }

    // Decrypt the secret UUID using the master key
    // const secretUUID = CryptoJS.AES.decrypt(
    //   encryptedSecret,
    //   process.env.MASTER_KEY
    // ).toString(CryptoJS.enc.Utf8);

    // if (!secretUUID) {
    //   return res.status(400).json({ msg: "Failed to decrypt secret key" });
    // }

    // Decrypt the text using the decrypted secretUUID
    const decryptedText = CryptoJS.AES.decrypt(
      encryptedText,
      secretUUID
    ).toString(CryptoJS.enc.Utf8);

    console.log("decryptedText", decryptedText);

    if (!decryptedText) {
      return res
        .status(400)
        .json({ msg: "Failed to decode the secret message from the image" });
    }

    // Respond with the decrypted secret text
    return res.status(200).json({
      msg: "Secret Decoded Successfully",
      secretText: decryptedText,
    });
  } catch (error) {
    console.error("Error decoding the image:", error);
    return res.status(500).json({ msg: "Error decoding the image" });
  }
};

export const Destroy = async (req, res) => {
  console.log("Destroying process initiated...");

  const { senderEmail } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  try {
    // Extract the custom encoded data from the image
    const imageBuffer = req.file.buffer.toString("utf-8");

    // Look for the embedded data (e.g., JSON string after the comment tag `<!--`)
    const encodedDataMatch = imageBuffer.match(/<!--\s*({.*})\s*-->/);
    // console.log("encodeed data", encodedDataMatch);
    if (!encodedDataMatch) {
      return res
        .status(400)
        .json({ msg: "No encoded data found in the image" });
    }

    const encodedData = JSON.parse(encodedDataMatch[1]);
    const { hash, encryptedText } = encodedData;
    let encryptedSecret = "";
    console.log(hash);
    console.log(encryptedText);
    // console.log(encryptedSecret);
    // Fetch all sessions for the receiver email from the database
    const sessions = await Session.find({ senderMail: senderEmail });
    console.log(sessions);

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: "Secret already destroyed" });
    }

    let validSession = null;

    // Decrypt the secret UUID using the master key
    let secretUUID;
    let destroySecretNumber;
    let sender;
    let reciever;

    //  if (!secretUUID) {
    //    return res.status(400).json({ msg: "Failed to decrypt secret key" });
    //  }

    // Loop through all sessions and validate hash
    for (const session of sessions) {
      encryptedSecret = session.randomNumber;

      const randomNumberDecrypt = CryptoJS.AES.decrypt(
        encryptedSecret,
        process.env.MASTER_KEY
      ).toString(CryptoJS.enc.Utf8);

      console.log(randomNumberDecrypt);
      secretUUID = randomNumberDecrypt;

      const combinedString = `${session.senderMail}:${session.recieverMail}:${secretUUID}`;

      // const combinedStringHash = bcrypt.hashSync(combinedString, 12);
      // Compare the plain combined string against the saved hash

      console.log(combinedString);
      if (bcrypt.compareSync(combinedString, hash)) {
        console.log(true);
        validSession = session;
        destroySecretNumber = session.randomNumber;
        sender = session.senderMail;
        reciever = session.recieverMail;
        break;
      }
    }

    console.log("valid session : ", validSession);

    if (!validSession) {
      return res.status(400).json({ msg: "Secret already destroyed" });
    }

    // Decrypt the secret UUID using the master key
    // const secretUUID = CryptoJS.AES.decrypt(
    //   encryptedSecret,
    //   process.env.MASTER_KEY
    // ).toString(CryptoJS.enc.Utf8);

    // if (!secretUUID) {
    //   return res.status(400).json({ msg: "Failed to decrypt secret key" });
    // }

    // Decrypt the text using the decrypted secretUUID
    const destroySessions = await Session.deleteMany({
      randomNumber: destroySecretNumber,
    });

    //Mail reciever and sender that secret is destroyed

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: [sender, reciever],
      subject: " Secret Destroyed",
      html: `
  <p>Dear,</p>
  <p>I hope this message finds you well.</p>
  <p>We would like to inform you that the secret embedded in the attached image has been securely destroyed. This action ensures that the encoded information is no longer accessible or retrievable.</p>
  <p>Thank you for your understanding and trust in Secret Frame for your secure communication needs.</p>
  <p>Best regards,<br/>Secret Frame</p>
`,

      attachments: [
        {
          filename: "destroyed_secret.jpg", // The name of the file that will appear in the email
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
    });

    // Respond with the decrypted secret text
    return res.status(200).json({
      msg: "Destroy successful",
    });
  } catch (error) {
    console.error("Error destroying the image:", error);
    return res.status(500).json({ msg: "Error destroying the image" });
  }
};

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

export const mailRecieverSecret = async (req, res) => {
  console.log(req.body);
  const { secret, email } = req?.body;

  console.log("Mail Reciever Secret");
  console.log(secret);
  console.log(email);

  if (!email || !secret) {
    return res.status(400).json({ msg: "Email is required" });
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
    subject: "Decoded Secret ",
    html: `
      <p>Dear,</p>
<p>I hope you're doing well!</p>
<p>As per our previous discussion, I’m sharing with you the decoded secret message from the image. Below is the message:</p>
<p><strong>Secret Message: </strong> ${secret}</p>
<p>Best regards,<br/>Secret Frame</p>

    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ msg: "Failed to send email" });
    }
    res.status(200).json({ msg: "Email sent successfully", info });
  });
};
