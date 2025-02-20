import dotenv from "dotenv";
import express,{Request,Response} from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { ContentModel, LinkModel, UserModel } from "./db";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userMiddleware} from "./middleware";
import { randomHash } from "./utils";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4040;
const JWT_SECRETS= process.env.JWT_SECRET || "";
console.log("indexedDB.ts Secret:",JWT_SECRETS);
const MONGO_URL= process.env.MONGO_URL || "";

if(!MONGO_URL){
  console.error("MONGO_URL is not defined in the environment variables.");
  process.exit(1);
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
  userName:z.string()
  .min(3,"Atlest more than 3 character")
  .max(30,"Not more than 30 character")
  .trim(),
  email:z.string().email("Invalid email formate").trim(),
  password:z.string()
  .min(7,"Atlest more than 7 character")
  .max(30,"Not more than 30 character")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,"required atlest one uppercase,one lowercase,one number,one special character is required")
})

const contentZodSchema = z.object({
  title: z.string(), 
  link: z.string().optional(), 
  type: z.enum(['image', 'video', 'article', 'audio','twitter','youtube']).optional(), 
  tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")).optional(), 
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional()
});



app.post("/api/v1/signup",async function (req:Request,res:Response){
  try {
    const {userName,email,password} = req.body;
    const validateUser = userZodSchema.safeParse({userName,email,password});
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
      userName,
      email,
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
    const {userName,email,password} = req.body;
    const validateUser = userZodSchema.safeParse({userName,email,password});
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

    const authorization = jwt.sign({ id: existingUser._id }, JWT_SECRETS);
    res.status(200).json({ message: `${userName} signin successful `, token:authorization });
    

    console.log("User Signin Token :", authorization);
    
  } catch (error:any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
    return 
  }
});
interface AuthenticatedRequest extends Request {
  User?: JwtPayload | string;
}

app.post("/api/v1/content",userMiddleware,async (req: Request, res: Response) => {
    try {
      const user =  (req as AuthenticatedRequest).User as{id:string; iat: number; exp: number }; // Access the `User` field added by middleware
      const userId = user.id;
      const {title,link,type} = req.body
      const content = contentZodSchema.safeParse({title,link,type,userId})
      if(!content.success){
        res.status(403).json({message:"Invaild format for content",error:content.error.errors})
        return
      }
      const createContent = await ContentModel.create({
        title,
        link,
        type,
        userId:user.id,
      }) 
      res.status(201).json({message:"Created Content",content:createContent})
    } catch (error: any) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
      return
    }
  }
);



app.get("/api/v1/content",userMiddleware,async (req:Request,res:Response)=>{
try {
  const user=(req as AuthenticatedRequest).User as {id:string,iat:number,exp:number}
  console.log("Inside get /api/v1/content  :",user);
  const userId=user.id;
  if(!userId){
    res.status(400).json({message:"User id is not there"})
  }
  const content=await ContentModel.find({userId}).populate("userId","email")
  if(!content || content.length === 0){
    res.status(400).json({message:"No content Present"})
    return
  }
  res.status(200).json({message:"All Your Content : ", content : content})
} catch (e:any) {
  res.status(500).json({message:"Internal Server Error"})
  return
}
})


app.delete("/api/v1/content", userMiddleware, async function (req: Request, res: Response) {
  try {
    const user = (req as AuthenticatedRequest).User as { id: string; iat: number; exp: number };
    const userId = user.id; 
    const contentId = req.body.contentId;

    if (!contentId) {
      res.status(400).json({ message: "Content ID is required" });
      return;
    }


    const contentExists = await ContentModel.findOne({ _id: contentId, userId });
    if (!contentExists) {
      res.status(400).json({ message: "This content does not belong to the user or does not exist" });
      return;
    }

    const contentDelete = await ContentModel.deleteOne({ _id: contentId, userId });
    if (contentDelete.deletedCount === 0) {
      res.status(400).json({ message: "This content does not belong to the user" });
      return;
    }

    res.status(200).json({ message: "Content Deleted" });
  } catch (e: any) {
    console.error("Something went wrong:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async function (req: Request, res: Response) {
  const user = (req as AuthenticatedRequest).User as { id: string; iat: number; exp: number };
  const userId = user.id;
  const share:boolean = req.body.share;
  console.log(share);
  console.log(typeof share);
  if (share) {
    try {
      const existingLink = await LinkModel.findOne({ userId });
      if (existingLink) {
        res.status(200).json({ hash: existingLink.hash });
        return 
      }

      const hash = randomHash(10);
      const link = await LinkModel.create({ userId, hash });
      res.status(200).json({ hash });
      return
    } catch (error) {
      console.error("Error creating or fetching link:", error);
      res.status(500).json({ message: "An error occurred" });
      return
    }
  } else {
    try {
      const result = await LinkModel.deleteOne({ userId });
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "No link found to delete" });
        return
      }
      res.status(200).json({ message: "Removed Sharable Link" });
      return
    } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ message: "An error occurred" });
      return
    }
  }
});



app.get("/api/v1/brain/:shareLink", async function (req, res) {
  try {
    const hash = req.params.shareLink;
    console.log("Share Link (hash):", hash);

    // Find the shared link
    const link = await LinkModel.findOne({ hash });
    if (!link) {
      console.log("No link found for hash:", hash);
      res.status(404).json({ message: "Invalid share link" });
      return;
    }
    console.log("Link object:", link);

    // Retrieve content
    const content = await ContentModel.find({ userId: link.userId });
    console.log("Content fetched:", content);

    // Retrieve user using _id instead of userId
    const user = await UserModel.findOne({ _id: link.userId });
    if (!user) {
      console.log("User not found for userId:", link.userId);
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log("User fetched:", user);

    // Respond with user and content
    res.json({
      user: { username: user.userName },
      content,
    });
  } catch (error) {
    console.error("Error retrieving brain data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





/*
"userName":"Zan",
    "email":"Zan@dev.com",
    "password":"Zen@1234"
  */
/*
{
  {
 "title": "bitcoin whitepaper",
    "link": "bitcoinwhitepaper.pdf",
    "type": "article",
    "tags": []
}
}
*/
/*
{
 "userName":"Asd",
  "email":"asd@gmail.com",
  "password":"Asd@1234"
}
  */