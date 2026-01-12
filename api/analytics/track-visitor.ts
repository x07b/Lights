import { IncomingMessage, ServerResponse } from "http";
import {
  parseBody,
  wrapResponse,
  setupCORS,
} from "../helpers.js";
import { trackVisitor } from "../../server/routes/analytics.js";

export const config = {
  runtime: "nodejs",
};

export default async (
  req: IncomingMessage & {
    query?: Record<string, any>;
    body?: any;
    params?: Record<string, any>;
  },
  res: ServerResponse,
) => {
  // Wrap response with Express-style methods
  const wrappedRes = wrapResponse(res);

  // Enable CORS
  setupCORS(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    // Parse request body
    req.body = await parseBody(req);

    // Only allow POST method
    if (req.method === "POST") {
      // POST /api/analytics/track-visitor
      return trackVisitor(req as any, wrappedRes as any);
    }

    return wrappedRes.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return wrappedRes
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
