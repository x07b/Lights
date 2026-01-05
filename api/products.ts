import { IncomingMessage, ServerResponse } from "http";
import { parseBody, wrapResponse, setupCORS, parseQueryString } from "./helpers";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
} from "../server/routes/products";

export const config = {
  runtime: "nodejs",
};

export default async (
  req: IncomingMessage & { query?: Record<string, any>; body?: any; params?: Record<string, any> },
  res: ServerResponse
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

    // Parse query string
    req.query = parseQueryString(req);
    const { id, action } = req.query;
    req.params = {};

    // Route based on method and path
    if (req.method === "GET") {
      // GET /api/products - get all products
      if (!id) {
        return getProducts(req as any, wrappedRes as any);
      }

      // GET /api/products/:id - get product by ID or slug
      if (id && !action) {
        req.params = { id: id as string };
        return getProductById(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Invalid query parameters" });
    }

    if (req.method === "POST") {
      // POST /api/products - create product
      if (!id) {
        return createProduct(req as any, wrappedRes as any);
      }

      // POST /api/products/:id/images - add product image
      if (id && action === "images") {
        req.params = { id: id as string };
        return addProductImage(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Invalid endpoint" });
    }

    if (req.method === "PUT") {
      // PUT /api/products/:id - update product
      if (id && !action) {
        req.params = { id: id as string };
        return updateProduct(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Product ID is required" });
    }

    if (req.method === "DELETE") {
      // DELETE /api/products/:id - delete product
      if (id && !action) {
        req.params = { id: id as string };
        return deleteProduct(req as any, wrappedRes as any);
      }

      // DELETE /api/products/:id/images - remove product image
      if (id && action === "images") {
        req.params = { id: id as string };
        return removeProductImage(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Product ID is required" });
    }

    return wrappedRes.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return wrappedRes
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
