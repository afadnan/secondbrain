import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";


dotenv.config();
// console.log("MONGO_URL:", process.env.MONGO_URL);
const app = express();
const PORT = process.env.PORT || 4040;
const MONGO_URL= process.env.MONGO_URL || "";
if(!MONGO_URL){
    throw new Error("MONGO URL is not a string");
}
async function main() {
  try {
    console.log("Connecting to DB");
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is Running on http://${PORT}`);
    });
  } catch (e) {
    console.error("DB is not connected ");
    console.log("Internal Server Error : ", e);
    process.exit(1);
  }
}
main();

app.post("/api/v1/signup", function (req, res) {
  const { email, password } = req.body;
});

app.post("/api/v1/signin", function (req, res) {
  const { email, password } = req.body;
  
});

app.post("/api/v1/content", function (req, res) {});

app.get("/api/v1/content", function (req, res) {});

app.delete("/api/v1/content", function (req, res) {});

app.post("/api/v1/brain/share", function (req, res) {});

app.get("/api/v1/brain/:shareLink", function (req, res) {});
