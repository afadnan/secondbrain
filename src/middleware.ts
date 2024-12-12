import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthenticatedRequest extends Request {
  User: JwtPayload | string;
}

export function userMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header is missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token is missing" });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as AuthenticatedRequest).User = decodedToken; // Explicitly cast the type
    next();
  } catch (error: any) {
    res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
}
