import { IncomingMessage, ServerResponse } from "http";
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
} from "../server/routes/orders";

export const config = {
  runtime: "nodejs",
};

export default async (
  req: IncomingMessage & { query?: Record<string, any>; body?: any },
  res: ServerResponse
) => {
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
    const { panierCode, id, status, search, query } = req.query;

    // Route based on method and query parameters
    if (req.method === "GET") {
      // GET /api/orders - get all orders
      if (!panierCode && !id && !status && !search && !query) {
        return getOrders(req as any, res as any);
      }

      // GET /api/orders?panierCode=... - get order by panier code
      if (panierCode) {
        (req as any).params = { panierCode: panierCode as string };
        return getOrderByPanierCode(req as any, res as any);
      }

      // GET /api/orders?id=... - get order by ID
      if (id) {
        (req as any).params = { id: id as string };
        return getOrderById(req as any, res as any);
      }

      // GET /api/orders?status=... - get orders by status
      if (status) {
        (req as any).params = { status: status as string };
        return getOrdersByStatus(req as any, res as any);
      }

      // GET /api/orders?search=... - search orders
      if (search || query) {
        (req as any).query = { query: (search || query) as string };
        return searchOrders(req as any, res as any);
      }

      return res.status(400).json({ error: "Invalid query parameters" });
    }

    if (req.method === "POST") {
      // POST /api/orders - create order
      return createOrder(req as any, res as any);
    }

    if (req.method === "PUT") {
      // PUT /api/orders?id=... - update order
      if (id) {
        (req as any).params = { id: id as string };

        // Check if updating status or full order
        if (req.body.status && Object.keys(req.body).length === 1) {
          return updateOrderStatus(req as any, res as any);
        }

        return updateOrder(req as any, res as any);
      }

      return res.status(400).json({ error: "Order ID is required" });
    }

    if (req.method === "DELETE") {
      // DELETE /api/orders?id=... - delete order
      if (id) {
        (req as any).params = { id: id as string };
        return deleteOrder(req as any, res as any);
      }

      return res.status(400).json({ error: "Order ID is required" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
