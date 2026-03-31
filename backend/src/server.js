import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

// middleware
app.use(express.json());

// CORS setup (important for frontend connection)
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Clerk auth middleware
app.use(clerkMiddleware());

// routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// health check route
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is up and running 🚀" });
});

// root route
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

// start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = ENV.PORT || 10000;

    app.listen(PORT, () => {
      console.log("✅ Server is running on port:", PORT);
    });
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();