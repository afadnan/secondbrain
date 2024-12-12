import dotenv from "dotenv";
import express,{Request,Response} from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { UserModel } from "./db";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userMiddleware} from "./middleware";

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

const userZodSchema = z.object({
  email:z.string().email("Invalid email formate").trim(),
  password:z.string()
  .min(7,"atlest more than 7 character")
  .max(30,"not more than 30 character")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,"required atlest one uppercase,one lowercase,one number,one special character is required")
})

const contentZodSchema = z.object({
  title: z.string(), // 
  link: z.string().optional(), // 
  type: z.enum(['image', 'video', 'article', 'audio']), 
  tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")), 
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId") 
});


app.post("/api/v1/signup",async function (req:Request,res:Response){
  try {
    const {email,password} = req.body;
    const validateUser = userZodSchema.safeParse({email,password});
    if(!validateUser.success){
      res.status(400).json({message:"follow the formate"})
      console.log(validateUser.error.format())
      return
    }
    const existingUser = await UserModel.findOne({email : email})
    if(existingUser){
      res.status(400).json({message:"This email alredy exists",email:email})
      return
    }
    const passwordHash = await bcrypt.hash(password,5)
    const newUser = await UserModel.create({
      email:email,
      password:passwordHash,
    })
    res.status(201).json({message:"user signup successfull",email:newUser.email})
  
  } catch (error:any) {
    console.error("Internal Server Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/api/v1/signin",async function(req:Request, res:Response) {
  try {
    const {email,password} = req.body;
    const validateUser = userZodSchema.safeParse({email,password});
    if(!validateUser.success){
      res.status(400).json({message:"follow the formate"})
      console.error(validateUser.error.format())
      return
    }
    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      res.status(400).json({ message: "User does not exist with this email,Please Signin First." });
      return
    }
    const storePassword = existingUser.password;
    const matchPassword = await bcrypt.compare(password, storePassword);

    if (!matchPassword) {
      res.status(400).json({ message: "Incorrect Password" });
      return
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRETS, { expiresIn: "1h" });
    res.status(200).json({ message: `${email} signin successful `, token:token });
  } catch (error:any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
    return 
  }
});
interface AuthenticatedRequest extends Request {
  User: JwtPayload | string;
}

app.post("/api/v1/content",userMiddleware,(req: Request, res: Response) => {
    try {
      const userId =  (req as AuthenticatedRequest).User as{id:string}; // Access the `User` field added by middleware
      const onlyUserId = userId.id;
      res.status(200).json({ message: "User ID received", onlyUserId });
    } catch (error: any) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  }
);



app.get("/api/v1/content", function (req, res) {});

app.delete("/api/v1/content", function (req, res) {});

app.post("/api/v1/brain/share", function (req, res) {});

app.get("/api/v1/brain/:shareLink", function (req, res) {});
