import { serve } from '@hono/node-server';
import { config } from 'dotenv';

// Load environment variables
config();

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