import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../server/routes/collections";

export const config = {
  runtime: "nodejs",
};

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token,X-Forwarded-Host,X-URL-Scheme,x-middleware-preflight,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;

    // Route based on method
    if (req.method === "GET") {
      // GET /api/collections - get all collections
      if (!id) {
        return getCollections(req as any, res as any);
      }

      // GET /api/collections/:id - get collection by ID or slug
      if (id) {
        (req as any).params = { id: id as string };
        return getCollectionById(req as any, res as any);
      }

      return res.status(400).json({ error: "Invalid query parameters" });
    }

    if (req.method === "POST") {
      // POST /api/collections - create collection
      return createCollection(req as any, res as any);
    }

    if (req.method === "PUT") {
      // PUT /api/collections/:id - update collection
      if (id) {
        (req as any).params = { id: id as string };
        return updateCollection(req as any, res as any);
      }

      return res.status(400).json({ error: "Collection ID is required" });
    }

    if (req.method === "DELETE") {
      // DELETE /api/collections/:id - delete collection
      if (id) {
        (req as any).params = { id: id as string };
        return deleteCollection(req as any, res as any);
      }

      return res.status(400).json({ error: "Collection ID is required" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
