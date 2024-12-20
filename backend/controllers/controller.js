import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import {Session,Users} from "../model/Session.js";
import { randomInt } from "crypto";
dotenv.config();

export const Encode = async (req, res) => {
  console.log("We got the encode sir");
  // console.log(req.body.st, req.body.recieverEmail, req.body.senderEmail);
  const { st, recieverEmail, senderEmail } = req.body;
  //   return res.status(200).json({ msg: "Encode API worked! Bingo!!" });

  if (!req.file) {
    return res.status(400).json({ msg: "No image uploaded" });
  }

  // The game starts here
  // Encode
  // encrypt the text with the secret and store in image and send backto user

  // Decode
  // Then we will take that secret and decrypt the text and mailto urself and display.

  // Aditinally we will prompt sender to destroy this if he destries the will destroy from db

  const secretUUID = uuidv4();
  // console.log(secretUUID);

 
  const combinedString = `${senderEmail}:${recieverEmail}:${secretUUID}`;

  const hash = bcrypt.hashSync(combinedString, 12);

  const encryptedSecret = CryptoJS.AES.encrypt(
    secretUUID,
    process.env.MASTER_KEY
  ).toString();

  const encrypted = CryptoJS.AES.encrypt(st, secretUUID).toString();

  // console.log(hash);
  // console.log(encrypted);
  // console.log(encryptedSecret);

  const sessionData = new Session({
    senderMail: senderEmail,
    randomNumber: encryptedSecret,
    recieverMail: recieverEmail,
  });

  const savedSession = await sessionData.save();
  // console.log("Session saved successfully:", savedSession);


  const userDataSender = new Users({
    email: senderEmail,
  });

  const userDataReciever = new Users({
    email: recieverEmail,
  });

  
  const usersFound = await Users.find({
    $or: [{ email: senderEmail }, { email: recieverEmail }],
  });

  const userFoundSender = usersFound.find((user) => user.email === senderEmail);
  const userFoundReciever = usersFound.find(
    (user) => user.email === recieverEmail
  );

  
  if (!userFoundSender) {
    const userCreation = await userDataSender.save();
    // console.log("Sender user created successfully: ", userCreation);
  }

 
  if (!userFoundReciever) {
    const userCreation = await userDataReciever.save();
    // console.log("Receiver user created successfully: ", userCreation);
  }

  const encodedData = JSON.stringify({
    hash: hash,

    encryptedText: encrypted,
  });


  sharp(req.file.buffer)
    .toBuffer()
    .then((imageBuffer) => {
      
      const combinedBuffer = Buffer.concat([
        imageBuffer,
        Buffer.from(`\n<!-- ${encodedData} -->`), 
      ]);

     
      res.setHeader("Content-Type", req.file.mimetype);
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="encoded_image.jpg"'
      );

      
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
    
    const imageBuffer = req.file.buffer.toString("utf-8");

  
    const encodedDataMatch = imageBuffer.match(/<!--\s*({.*})\s*-->/);
  
    if (!encodedDataMatch) {
      return res
        .status(400)
        .json({ msg: "No encoded data found in the image" });
    }

    const encodedData = JSON.parse(encodedDataMatch[1]);
    const { hash, encryptedText } = encodedData;
    let encryptedSecret = "";
    // console.log(hash);
    // console.log(encryptedText);
    const sessions = await Session.find({ recieverMail: recieverEmail });
    // console.log(sessions);

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: "No secrets found for this image" });
    }

    let validSession = null;

    let secretUUID;

    //  if (!secretUUID) {
    //    return res.status(400).json({ msg: "Failed to decrypt secret key" });
    //  }

  
    for (const session of sessions) {
      encryptedSecret = session.randomNumber;

      const randomNumberDecrypt = CryptoJS.AES.decrypt(
        encryptedSecret,
        process.env.MASTER_KEY
      ).toString(CryptoJS.enc.Utf8);

      // console.log(randomNumberDecrypt);
      secretUUID = randomNumberDecrypt;

      const combinedString = `${session.senderMail}:${session.recieverMail}:${secretUUID}`;

      // console.log(combinedString);
      if (bcrypt.compareSync(combinedString, hash)) {
        // console.log(true);
        validSession = session;

        break;
      }
    }

    // console.log("valid session : ", validSession);

    if (!validSession) {
      return res.status(400).json({ msg: "No secrets found for this image" });
    }


    const decryptedText = CryptoJS.AES.decrypt(
      encryptedText,
      secretUUID
    ).toString(CryptoJS.enc.Utf8);

    // console.log("decryptedText", decryptedText);

    if (!decryptedText) {
      return res
        .status(400)
        .json({ msg: "Failed to decode the secret message from the image" });
    }

  
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

    const imageBuffer = req.file.buffer.toString("utf-8");

  
    const encodedDataMatch = imageBuffer.match(/<!--\s*({.*})\s*-->/);
   
    if (!encodedDataMatch) {
      return res
        .status(400)
        .json({ msg: "No encoded data found in the image" });
    }

    const encodedData = JSON.parse(encodedDataMatch[1]);
    const { hash, encryptedText } = encodedData;
    let encryptedSecret = "";
    // console.log(hash);
    // console.log(encryptedText);
    
    const sessions = await Session.find({ senderMail: senderEmail });
    // console.log(sessions);

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: "Secret already destroyed" });
    }

    let validSession = null;

   
    let secretUUID;
    let destroySecretNumber;
    let sender;
    let reciever;

    //  if (!secretUUID) {
    //    return res.status(400).json({ msg: "Failed to decrypt secret key" });
    //  }

    
    for (const session of sessions) {
      encryptedSecret = session.randomNumber;

      const randomNumberDecrypt = CryptoJS.AES.decrypt(
        encryptedSecret,
        process.env.MASTER_KEY
      ).toString(CryptoJS.enc.Utf8);

      // console.log(randomNumberDecrypt);
      secretUUID = randomNumberDecrypt;

      const combinedString = `${session.senderMail}:${session.recieverMail}:${secretUUID}`;

      // console.log(combinedString);
      if (bcrypt.compareSync(combinedString, hash)) {
        // console.log(true);
        validSession = session;
        destroySecretNumber = session.randomNumber;
        sender = session.senderMail;
        reciever = session.recieverMail;
        break;
      }
    }

    // console.log("valid session : ", validSession);

    if (!validSession) {
      return res.status(400).json({ msg: "Secret already destroyed" });
    }

    const destroySessions = await Session.deleteMany({
      randomNumber: destroySecretNumber,
    });

    

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
          filename: "destroyed_secret.jpg", 
          content: req.file.buffer, 
          contentType: req.file.mimetype, 
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ msg: "Failed to send email" });
      }
    });

  
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
        filename: "encoded_image.jpg", 
        content: req.file.buffer, 
        contentType: req.file.mimetype, 
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
  // console.log(req.body);
  const { secret, email } = req?.body;

  console.log("Mailing Reciever Secret");
  // console.log(secret);
  // console.log(email);

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

export const UsersCount = async (req, res) => {
  const count = await Users.countDocuments();
  const encode = await Session.countDocuments();

  return res.status(200).json({ count: count,encode:encode });
}
