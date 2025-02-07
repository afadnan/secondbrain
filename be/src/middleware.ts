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

  // Split the header on spaces.
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Authorization header format must be: Bearer <token>" });
    return;
  }
  
  // Extract only the token part
  const token = parts[1];
  console.log("Extracted Token:", token);

  try {
    const decodedToken = jwt.verify(token, JWT_SECRETS) as JwtPayload;
    (req as AuthenticatedRequest).User = decodedToken;
    return next();
  } catch (error: any) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token", error: error.message });
    return;
  }
}
