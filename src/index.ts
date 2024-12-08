import dotenv from "dotenv";
import express,{Request,Response} from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { userZodSchema } from "./validation";
import { UserModel } from "./db";
import bcrypt from "bcrypt";
dotenv.config();



const app = express();
app.use(express.json());
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
      console.log(`Server is Running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("DB is not connected ");
    console.log("Internal Server Error : ", e);
    process.exit(1);
  }
}
main();
//@ts-ignore
app.post("/api/v1/signup",async function (req:Request,res:Response){
  try {
    const validateUser = userZodSchema.parse(req.body);
    const existingUser = await UserModel.findOne({email : validateUser.email})
    if(existingUser){
      return res.status(400).json({message:"This email alredy exists",email:validateUser.email})
    }
    const passwordHash = await bcrypt.hash(validateUser.password,5)
    const newUser = await UserModel.create({
      email:validateUser.email,
      password:passwordHash,
    })
    res.status(201).json({message:"user signup successfull",email:newUser.email})
  
  } catch (error:any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Zod Validation Incorrect",
        errors: error.errors,
      });
    }

    // Handle all other errors
    console.error("Internal Server Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
});



app.post("/api/v1/signin", function (req, res) {
  const { email, password } = req.body;
  
});

app.post("/api/v1/content", function (req, res) {});

app.get("/api/v1/content", function (req, res) {});

app.delete("/api/v1/content", function (req, res) {});

app.post("/api/v1/brain/share", function (req, res) {});

app.get("/api/v1/brain/:shareLink", function (req, res) {});
