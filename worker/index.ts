import { Hono } from "hono";
import { cors } from "hono/cors";
import usersApi from "./routes/users";
import claimsApi from "./routes/claims";
import notesApi from "./routes/notes";
import reportsApi from "./routes/reports";
import companyApi from "./routes/company";

// ✅ Shared type for environment bindings
export type Bindings = {
  NEON_DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  ASSETS: Fetcher;
};

// ✅ App instance with typed bindings
export const app = new Hono<{ Bindings: Bindings; Variables: {} }>();

// 🔐 CORS middleware
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:4173",
      "https://zenassess.YOUR-SUBDOMAIN.workers.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// 🫀 Health check
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

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

// 🪄 Cloudflare Worker export
export default {
  fetch: app.fetch,
};
