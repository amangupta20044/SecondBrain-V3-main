import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../db/db";
dotenv.config();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "randomjwtsecret";

export interface UserPayload {
  email: string;
  username: string;
  userId: string;
}

export interface CustomRequest extends Request {
  user?: UserPayload;
}

async function userMiddleware(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        message: "Authentication denied. Authorization header missing."
      });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : authHeader.trim();

    if (!token) {
      res.status(401).json({
        message: "No token provided, access denied."
      });
      return;
    }

    const decoded = jwt.verify(token, USER_JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({
        message: "Invalid token payload."
      });
      return;
    }

    const userDoc = await UserModel.findById(decoded.id).select("-password");
    if (!userDoc) {
      res.status(404).json({
        message: "User account no longer exists."
      });
      return;
    }

    const user: UserPayload = {
      email: userDoc.email || "",
      username: userDoc.username || "",
      userId: userDoc._id.toString(),
    };

    req.user = user;
    next();
  } catch (error: any) {
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd) {
      console.error("Auth middleware error:", error.message);
    }
    res.status(401).json({
      message: "Token is invalid or expired."
    });
    return;
  }
}

export default userMiddleware;