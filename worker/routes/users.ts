import { Hono } from "hono";

const usersApi = new Hono();

// Simple health check for users route
usersApi.get("/health", async (c) => {
  return c.json({ status: "ok", route: "users" });
});

export default usersApi;