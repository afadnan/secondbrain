import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";


declare global {
  namespace Express {
    interface Request {
      User?: JwtPayload | string;
    }
  }
}

function userMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.User = decodedToken; // Attach decoded data to req for further use
    next(); // Pass control to the next middleware
  } catch (error:any) {
    res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
}

export { userMiddleware };
