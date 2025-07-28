import { serve } from '@hono/node-server';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from multiple locations
dotenvConfig({ path: './.env' });
dotenvConfig({ path: './worker/.env' });

// Debug environment loading
console.log("🔍 Server environment check:");
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "✅ EXISTS" : "❌ MISSING");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");

// Import the app using dynamic import to handle TypeScript
async function startServer() {
  try {
    const { app } = await import('./worker/index.ts');
    
    const port = process.env.PORT || 8888;
    
    console.log(`🚀 Server starting on port ${port}`);
    
    serve({
      fetch: app.fetch,
      port: parseInt(port.toString()),
    });
    
    console.log(`✅ Server running at http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();