import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import usersApi from "./routes/users";
import claimsApi from "./routes/claims";
import notesApi from "./routes/notes";
import reportsApi from "./routes/reports";
import companyApi from "./routes/company";

// Load environment variables first
import { config } from 'dotenv';
config({ path: './worker/.env' });

// ✅ App instance
export const app = new Hono();

// 📝 Logger middleware
app.use("*", logger());

// 🔐 CORS middleware
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:3000",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// 🫀 Health check
app.get("/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: "node",
    database: process.env.NEON_DATABASE_URL ? "connected" : "not configured"
  });
});

// 🧩 Route mounting (modular, circular-safe)
app.route("/api/users", usersApi);
app.route("/api/claims", claimsApi);
app.route("/api/notes", notesApi);
app.route("/api/reports", reportsApi);
app.route("/api/company", companyApi);

// 🧯 404 fallback for unmatched API routes
app.notFound((c) => {
  const path = new URL(c.req.url).pathname;
  return path.startsWith("/api/")
    ? c.json({ error: "API endpoint not found" }, 404)
    : c.json({ error: "Not found" }, 404);
});

// 🚨 Global error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// Export for Node.js server
export default app;
