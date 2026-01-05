import { VercelRequest, VercelResponse } from "@vercel/node";
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
    const { id, action } = req.query;

    // Route based on method and path
    if (req.method === "GET") {
      // GET /api/products - get all products
      if (!id) {
        return getProducts(req as any, res as any);
      }

      // GET /api/products/:id - get product by ID or slug
      if (id && !action) {
        (req as any).params = { id: id as string };
        return getProductById(req as any, res as any);
      }

      return res.status(400).json({ error: "Invalid query parameters" });
    }

    if (req.method === "POST") {
      // POST /api/products - create product
      if (!id) {
        return createProduct(req as any, res as any);
      }

      // POST /api/products/:id/images - add product image
      if (id && action === "images") {
        (req as any).params = { id: id as string };
        return addProductImage(req as any, res as any);
      }

      return res.status(400).json({ error: "Invalid endpoint" });
    }

    if (req.method === "PUT") {
      // PUT /api/products/:id - update product
      if (id && !action) {
        (req as any).params = { id: id as string };
        return updateProduct(req as any, res as any);
      }

      return res.status(400).json({ error: "Product ID is required" });
    }

    if (req.method === "DELETE") {
      // DELETE /api/products/:id - delete product
      if (id && !action) {
        (req as any).params = { id: id as string };
        return deleteProduct(req as any, res as any);
      }

      // DELETE /api/products/:id/images - remove product image
      if (id && action === "images") {
        (req as any).params = { id: id as string };
        return removeProductImage(req as any, res as any);
      }

      return res.status(400).json({ error: "Product ID is required" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
