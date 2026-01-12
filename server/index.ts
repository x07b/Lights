import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { supabase } from "./lib/supabase";
import { validateEnv, logValidationResults } from "./lib/env-validator";
import { handleDemo } from "./routes/demo";
import { uploadFile } from "./routes/upload";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
} from "./routes/products";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "./routes/collections";
import {
  handleContact,
  getContactMessages,
  markMessageAsRead,
} from "./routes/contact";
import {
  createOrder,
  getOrders,
  getOrderByPanierCode,
  getOrderById,
  searchOrders,
  updateOrderStatus,
  getOrdersByStatus,
  updateOrder,
  deleteOrder,
} from "./routes/orders";
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "./routes/slides";
import {
  createQuoteRequest,
  getQuoteRequests,
  getQuoteRequestById,
  updateQuoteRequestStatus,
  deleteQuoteRequest,
} from "./routes/quotes";
import {
  getProductDetails,
  upsertProductDetails,
  deleteProductDetail,
} from "./routes/product-details";
import { trackVisitor, getVisitorStats } from "./routes/analytics";

export function createServer() {
  // Validate environment configuration at server startup
  const envValidation = validateEnv();
  logValidationResults(envValidation);

  if (!envValidation.valid) {
    console.error(
      "Server initialization failed due to invalid environment configuration."
    );
    console.error("Please fix the errors above and restart the server.");
    // In production, we might want to fail hard here
    // For development, we'll log but continue
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration");
    }
  }

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Debug endpoint to test Supabase connection (development only)
  // WARNING: This endpoint should be protected or removed in production
  app.get("/api/debug", async (_req, res) => {
    try {
      const isDev = process.env.NODE_ENV !== "production";

      const hasSupabaseUrl = !!process.env.SUPABASE_URL;
      const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!hasSupabaseUrl || !hasSupabaseKey) {
        return res.status(500).json({
          status: "error",
          message: "Missing Supabase environment variables",
          hasUrl: hasSupabaseUrl,
          hasKey: hasSupabaseKey,
        });
      }

      // Try to fetch from products table
      const { data, error, status } = await supabase
        .from("products")
        .select("count", { count: "exact" });

      // In production, don't expose detailed error info
      const responseData: any = {
        status: error ? "error" : "ok",
        dbConnected: !error,
      };

      if (isDev) {
        responseData.dbStatus = status;
        responseData.dbError = error ? error.message : null;
        responseData.dbErrorCode = error?.code || null;
        responseData.productCount = data;
      } else {
        responseData.message = error
          ? "Database connection failed"
          : "Database connected";
      }

      res.status(error ? 500 : 200).json(responseData);
    } catch (error: any) {
      console.error("Debug endpoint error:", error);
      const isDev = process.env.NODE_ENV !== "production";
      res.status(500).json({
        status: "error",
        message: "Debug check failed",
        ...(isDev && { error: error.message }),
      });
    }
  });

  app.get("/api/demo", handleDemo);

  // File upload route
  app.post("/api/upload", uploadFile);

  // Products routes
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);
  app.post("/api/products/:id/images", addProductImage);
  app.delete("/api/products/:id/images", removeProductImage);

  // Collections routes
  app.get("/api/collections", getCollections);
  app.get("/api/collections/:id", getCollectionById);
  app.post("/api/collections", createCollection);
  app.put("/api/collections/:id", updateCollection);
  app.delete("/api/collections/:id", deleteCollection);

  // Contact routes
  app.post("/api/contact", handleContact);
  app.get("/api/contact/messages", getContactMessages);
  app.put("/api/contact/messages/:id/read", markMessageAsRead);

  // Orders routes (specific routes before generic :id route)
  app.post("/api/orders", createOrder);
  app.get("/api/orders", getOrders);
  app.get("/api/orders/search", searchOrders);
  app.get("/api/orders/status/:status", getOrdersByStatus);
  app.get("/api/orders/panier/:panierCode", getOrderByPanierCode);
  app.get("/api/orders/:id", getOrderById);
  app.put("/api/orders/:id/status", updateOrderStatus);
  app.put("/api/orders/:id", updateOrder);
  app.delete("/api/orders/:id", deleteOrder);

  // Hero slides routes
  app.get("/api/slides", getHeroSlides);
  app.post("/api/slides", createHeroSlide);
  app.put("/api/slides/:id", updateHeroSlide);
  app.delete("/api/slides/:id", deleteHeroSlide);

  // Quote requests routes
  app.post("/api/quotes", createQuoteRequest);
  app.get("/api/quotes", getQuoteRequests);
  app.get("/api/quotes/:id", getQuoteRequestById);
  app.put("/api/quotes/:id/status", updateQuoteRequestStatus);
  app.delete("/api/quotes/:id", deleteQuoteRequest);

  // Product details routes
  app.get("/api/products/:productId/details", getProductDetails);
  app.put("/api/products/:productId/details", upsertProductDetails);
  app.delete(
    "/api/products/:productId/details/:sectionId",
    deleteProductDetail,
  );

  // Analytics routes
  app.post("/api/analytics/track-visitor", trackVisitor);
  app.get("/api/analytics/visitors", getVisitorStats);

  // Serve static files from public directory (after API routes)
  app.use(express.static(path.join(process.cwd(), "public")));

  return app;
}
