import { RequestHandler } from "express";
import {
  getAllOrders,
  searchOrders,
  getOrderByPanierCode,
  updateOrderStatus,
} from "../data/orders";
import { Order } from "@shared/api";

export const handleGetAllOrders: RequestHandler = (_req, res) => {
  try {
    const orders = getAllOrders();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

export const handleSearchOrders: RequestHandler = (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    const results = searchOrders(query);
    res.status(200).json({
      success: true,
      orders: results,
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error searching orders",
    });
  }
};

export const handleGetOrderByCode: RequestHandler = (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Panier code is required",
      });
    }

    const order = getOrderByPanierCode(code);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
};

export const handleUpdateOrderStatus: RequestHandler = (req, res) => {
  try {
    const { code } = req.params;
    const { status } = req.body;

    if (!code || !status) {
      return res.status(400).json({
        success: false,
        message: "Panier code and status are required",
      });
    }

    const validStatuses = ["pending", "confirmed", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = updateOrderStatus(code, status as Order["status"]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order",
    });
  }
};
