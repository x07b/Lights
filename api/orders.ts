import { IncomingMessage, ServerResponse } from "http";
import { parseBody, wrapResponse, setupCORS, parseQueryString } from "./helpers";
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
    const { panierCode, id, status, search, query } = req.query;
    req.params = {};

    // Route based on method and query parameters
    if (req.method === "GET") {
      // GET /api/orders - get all orders
      if (!panierCode && !id && !status && !search && !query) {
        return getOrders(req as any, wrappedRes as any);
      }

      // GET /api/orders?panierCode=... - get order by panier code
      if (panierCode) {
        req.params = { panierCode: panierCode as string };
        return getOrderByPanierCode(req as any, wrappedRes as any);
      }

      // GET /api/orders?id=... - get order by ID
      if (id) {
        req.params = { id: id as string };
        return getOrderById(req as any, wrappedRes as any);
      }

      // GET /api/orders?status=... - get orders by status
      if (status) {
        req.params = { status: status as string };
        return getOrdersByStatus(req as any, wrappedRes as any);
      }

      // GET /api/orders?search=... - search orders
      if (search || query) {
        req.query = { query: (search || query) as string };
        return searchOrders(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Invalid query parameters" });
    }

    if (req.method === "POST") {
      // POST /api/orders - create order
      return createOrder(req as any, wrappedRes as any);
    }

    if (req.method === "PUT") {
      // PUT /api/orders?id=... - update order
      if (id) {
        req.params = { id: id as string };

        // Check if updating status or full order
        if (req.body.status && Object.keys(req.body).length === 1) {
          return updateOrderStatus(req as any, wrappedRes as any);
        }

        return updateOrder(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Order ID is required" });
    }

    if (req.method === "DELETE") {
      // DELETE /api/orders?id=... - delete order
      if (id) {
        req.params = { id: id as string };
        return deleteOrder(req as any, wrappedRes as any);
      }

      return wrappedRes.status(400).json({ error: "Order ID is required" });
    }

    return wrappedRes.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return wrappedRes
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
};
