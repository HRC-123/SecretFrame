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
  console.log("We got the encode sir");
  console.log(req.body.email);

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

  //Mail using Nodemailer

  return res.status(200).json({ msg: "Mail sent to reciever successfully" });
};
