/**
 * Vercel serverless function handler for all API routes
 * This wraps the Express server using serverless-http
 */
import serverless from "serverless-http";
import { createServer } from "../server";

// Create the Express app
const app = createServer();

// Export the handler for Vercel
export default serverless(app);
