import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    senderMail: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], 
    },
    randomNumber: {
      type: String,
      required: true,
    },
    recieverMail: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], 
    },
  },
  {
    timestamps: true, 
  }
);

const UsersCountSchema = new mongoose.Schema(
  {
    email: {
      type: String, 
      required: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], 
    }
  },
);


export const Session = mongoose.model("Session", sessionSchema);
export const Users = mongoose.model("Users", UsersCountSchema);
