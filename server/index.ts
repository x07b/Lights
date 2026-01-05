import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSendEmail } from "./routes/email";
import { handleCheckout } from "./routes/checkout";
import {
  handleGetAllOrders,
  handleSearchOrders,
  handleGetOrderByCode,
  handleUpdateOrderStatus,
} from "./routes/admin";
import {
  handleGetCollections,
  handleCreateCollection,
  handleGetCollection,
  handleUpdateCollection,
  handleDeleteCollection,
} from "./routes/collections";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Contact form email endpoint
  app.post("/api/send-email", handleSendEmail);

  // Checkout endpoint
  app.post("/api/checkout", handleCheckout);

  // Admin endpoints
  app.get("/api/admin/orders", handleGetAllOrders);
  app.get("/api/admin/orders/search", handleSearchOrders);
  app.get("/api/admin/orders/:code", handleGetOrderByCode);
  app.patch("/api/admin/orders/:code/status", handleUpdateOrderStatus);

  // Collections endpoints
  app.get("/api/collections", handleGetCollections);
  app.post("/api/collections", handleCreateCollection);
  app.get("/api/collections/:id", handleGetCollection);
  app.patch("/api/collections/:id", handleUpdateCollection);
  app.delete("/api/collections/:id", handleDeleteCollection);

  return app;
}
