import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());

// ✅ UPDATED CORS - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://video-callinng.onrender.com',
  ENV.CLIENT_URL
].filter(Boolean); // Remove empty values

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

// 🚨 ADD ROOT ROUTE TO FIX 404 ERRORS
app.get("/", (req, res) => {
  res.json({ 
    message: "Video Calling API is running",
    frontend: "https://video-calling-2-eeu0.onrender.com",
    endpoints: {
      health: "/health",
      active_sessions: "/api/sessions/active", 
      create_session: "/api/sessions"
    }
  });
});

// 🚨 DIRECT ROUTES FOR FRONTEND COMPATIBILITY
app.get('/sessions/active', async (req, res) => {
  try {
    res.status(200).json({ sessions: [] });
  } catch (error) {
    console.log("Error in getActiveSessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/sessions', async (req, res) => {
  try {
    const { problem, difficulty } = req.body;
    
    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const session = {
      id: Date.now(),
      problem,
      difficulty,
      status: "active",
      message: "Session created - update frontend to use /api/sessions"
    };

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();