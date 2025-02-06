import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthenticatedRequest extends Request {
  User?: JwtPayload | string;
}

export function userMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    req.User = jwt.verify(token, JWT_SECRET) as JwtPayload;
    next();
  } catch (error: any) {
    return res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
}
