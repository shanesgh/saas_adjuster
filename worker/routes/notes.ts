import { Hono } from "hono";

const notesApi = new Hono();

// Simple health check for notes route
notesApi.get("/health", async (c) => {
  return c.json({ status: "ok", route: "notes" });
});

export default notesApi;