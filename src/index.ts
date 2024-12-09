import dotenv from "dotenv";
import express,{Request,Response} from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { userZodSchema } from "./validation";
import { UserModel } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4040;
const JWT_SECRETS= process.env.JWT_SECRET || "";
const MONGO_URL= process.env.MONGO_URL || "";
if(!MONGO_URL){
    console.error("MONGO URL is not a string");
}
async function main() {
  try {
    console.log("Connecting to DB");
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is Running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("DB is not connected ");
    console.log("Internal Server Error : ", e);
    process.exit(1);
  }
}
main();

app.post("/api/v1/signup",async function (req:Request,res:Response){
  try {
    const validateUser = userZodSchema.parse(req.body);
    const existingUser = await UserModel.findOne({email : validateUser.email})
    if(existingUser){
      res.status(400).json({message:"This email alredy exists",email:validateUser.email})
      return
    }
    const passwordHash = await bcrypt.hash(validateUser.password,5)
    const newUser = await UserModel.create({
      email:validateUser.email,
      password:passwordHash,
    })
    res.status(201).json({message:"user signup successfull",email:newUser.email})
  
  } catch (error:any) {
    
    if (error === z.ZodError) {
      res.status(400).json({
        message: "Zod Validation Incorrect",
        errors: error.errors,
      });
    }
    console.error("Internal Server Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});

app.post("/api/v1/signin",async function(req:Request, res:Response) {
  try {
    const validateUser = userZodSchema.parse(req.body);
    const existingUser = await UserModel.findOne({ email: validateUser.email });

    if (!existingUser) {
      res.status(400).json({ message: "User does not exist with this email" });
      return
    }

    const storePassword = existingUser.password;
    const matchPassword = await bcrypt.compare(validateUser.password, storePassword);

    if (!matchPassword) {
      res.status(400).json({ message: "Incorrect Password" });
      return
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRETS, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error:any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
    return 
  }
});


app.post("/api/v1/content", function (req, res) {});

app.get("/api/v1/content", function (req, res) {});

app.delete("/api/v1/content", function (req, res) {});

app.post("/api/v1/brain/share", function (req, res) {});

app.get("/api/v1/brain/:shareLink", function (req, res) {});
