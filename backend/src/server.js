import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

// middleware
app.use(express.json());

// ✅ CORS - Allow both local and production
const allowedOrigins = [
  'http://localhost:5173',
  'https://video-calling-2-eeu0.onrender.com'
];

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(clerkMiddleware());

// API Routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// ✅ REMOVED static file serving - Pure API server
// Frontend separately hosted hai

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();