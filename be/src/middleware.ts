import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRETS = process.env.JWT_SECRET || "";
console.log("middleware secret : ",JWT_SECRETS);

export interface AuthenticatedRequest extends Request {
  User?: JwtPayload | string;
}

export function userMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing or malformed" });
    return;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header missing or malformed" });
    return
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token is missing" });
    return 
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRETS) as JwtPayload;
    console.log("Decoded Token inside the middleware : ",decodedToken);
    (req as AuthenticatedRequest).User = decodedToken;
    return next();
  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token", error: error.message });
    return;
  }
}
