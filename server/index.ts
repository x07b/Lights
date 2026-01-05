import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
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
} from "./routes/orders";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), "public")));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
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

  // Orders routes
  app.post("/api/orders", createOrder);
  app.get("/api/orders", getOrders);
  app.get("/api/orders/panier/:panierCode", getOrderByPanierCode);
  app.get("/api/orders/:id", getOrderById);
  app.get("/api/orders/search", searchOrders);
  app.put("/api/orders/:id/status", updateOrderStatus);
  app.get("/api/orders/status/:status", getOrdersByStatus);

  return app;
}
