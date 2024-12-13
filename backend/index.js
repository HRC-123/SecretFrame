import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import Connection from "./database/db.js";
import routes from "./routes/route.js"
import dotenv from "dotenv";

const app = express();

const __dirname = path.resolve();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',routes)

const PORT = process.env.port || 9000;
app.listen(PORT, () => {
  console.log("Sir, we are successfully connected to server");
  console.log(`The server running at ${PORT}`);
});

dotenv.config();

const URL = process.env.MONGODB_URI;
Connection(URL);
