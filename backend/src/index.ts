import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";
import userRouter from "./routes/user";
import contentRouter from "./routes/content";
import tagRouter from "./routes/tags";
import brainRouter from "./routes/brain";

dotenv.config();

// Startup Environment Variable Validation
const requiredEnvVars = ["MONGO_URI", "USER_JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`❌ CRITICAL: Missing required environment variables: ${missingEnvVars.join(", ")}`);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

if (!process.env.USER_JWT_SECRET || process.env.USER_JWT_SECRET === "randomjwtsecret") {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ CRITICAL: Insecure default USER_JWT_SECRET used in production! Halting server.");
    process.exit(1);
  } else {
    console.warn("⚠️ WARNING: Using fallback development JWT secret. Set USER_JWT_SECRET in .env for production.");
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security HTTP Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configurable Allowed CORS Origins
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://second-brain-v3-main.vercel.app",
  "https://second-brain-wine-sigma.vercel.app"
];

const envAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

interface ICorsOriginCallback {
  (err: Error | null, allow?: boolean): void;
}

app.use(
  cors({
    origin: (origin: string | undefined, callback: ICorsOriginCallback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Allow all Chrome extension origins
      if (origin.startsWith("chrome-extension://")) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

// Backwards-compatible check route
app.get("/check", (_req: Request, res: Response) => {
  res.json({ message: "I am good" });
});

// Production Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/brain", brainRouter);

// Global Unhandled Rejection & Uncaught Exception Handlers
process.on("unhandledRejection", (reason: any) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.error("❌ Uncaught Exception:", error);
});

let server: any;

async function bootstrap() {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
}

bootstrap();

// Graceful Server Shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log("🔒 HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;