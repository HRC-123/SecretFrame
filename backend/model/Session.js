import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    senderMail: {
      type: String, // Corrected the type to "String"
      required: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], // Regex validation for email
    },
    randomNumber: {
      type: String,
      required: true,
    },
    recieverMail: {
      type: String, // Corrected the type to "String"
      required: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], // Regex validation for email
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
