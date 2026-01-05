/**
 * Vercel serverless function handler for all API routes
 * This wraps the Express server using serverless-http
 */
import serverless from "serverless-http";
import { createServer } from "../server";

// Create the Express app (cached at module level)
const app = createServer();

// Wrap the app with serverless-http
const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

// Export the handler for Vercel
export default handler;
