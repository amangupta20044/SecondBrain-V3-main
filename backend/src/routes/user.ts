import { Request, Response, Router } from "express";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "../db/db";
import userMiddleware, { CustomRequest } from "../middleware/middleware";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "randomjwtsecret";

const userRouter = Router();

userRouter.get("/test", (req: Request, res: Response) => {
  res.json({
    message: "User route operational"
  });
});

userRouter.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const requiredBody = z.object({
    email: z.string().email("Invalid email format").max(100),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
    username: z.string().min(1, "Username is required").max(50),
  });

  const parsedData = requiredBody.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid request payload",
      errors: parsedData.error.errors
    });
    return;
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      res.status(409).json({
        message: "Account with this email or username already exists."
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error during user creation"
    });
  }
});

userRouter.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const requiredBody = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
  });

  const parsedData = requiredBody.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Username and password are required",
      errors: parsedData.error.errors
    });
    return;
  }

  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user || !user.password) {
      res.status(401).json({
        message: "Invalid username or password"
      });
      return;
    }

    const passCheck = await bcryptjs.compare(password, user.password);
    if (!passCheck) {
      res.status(401).json({
        message: "Invalid username or password"
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      USER_JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Internal server error during authentication"
    });
  }
});

userRouter.get("/contents", userMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.query.userID || req.user?.userId;
    if (!userId) {
      res.status(400).json({ message: "User ID parameter required" });
      return;
    }

    const content = await ContentModel.find({ userId }).populate({
      path: "tags",
      select: "title"
    });

    res.status(200).json(content);
  } catch (error: any) {
    console.error("Fetch contents error:", error);
    res.status(500).json({ message: "Internal server error fetching user content" });
  }
});

export default userRouter;