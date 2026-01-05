import { RequestHandler } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";

// Validation schemas
const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
});

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive().int(),
});

const createOrderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1),
  total: z.number().positive(),
});

// Order interface
export interface Order {
  id: string;
  panierCode: string;
  customer: z.infer<typeof customerSchema>;
  items: z.infer<typeof orderItemSchema>[];
  total: number;
  status: "en attente" | "en cours" | "livré" | "annulé";
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to convert DB order to API format
async function dbOrderToApi(dbOrder: any): Promise<Order> {
  // Fetch order items
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", dbOrder.id)
    .order("created_at", { ascending: true });

  if (itemsError) throw itemsError;

  return {
    id: dbOrder.id,
    panierCode: dbOrder.panier_code,
    customer: {
      name: dbOrder.customer_name,
      email: dbOrder.customer_email,
      phone: dbOrder.customer_phone,
      address: dbOrder.customer_address,
      city: dbOrder.customer_city,
      postalCode: dbOrder.customer_postal_code,
    },
    items:
      orderItems?.map((item) => ({
        id: item.product_id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })) || [],
    total: parseFloat(dbOrder.total),
    status: dbOrder.status,
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
  };
}

// Generate unique panier code
function generatePanierCode(): string {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `PANIER-${timestamp.toString().slice(-8)}-${random}`;
}

// Create order
export const createOrder: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validatedData = createOrderSchema.parse(req.body);

    // Generate order ID and panier code
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;
    const panierCode = generatePanierCode();

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        panier_code: panierCode,
        customer_name: validatedData.customer.name,
        customer_email: validatedData.customer.email,
        customer_phone: validatedData.customer.phone,
        customer_address: validatedData.customer.address,
        customer_city: validatedData.customer.city,
        customer_postal_code: validatedData.customer.postalCode,
        total: validatedData.total,
        status: "en attente",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = validatedData.items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Return success response with panier code
    res.status(201).json({
      success: true,
      message: "Commande créée avec succès",
      panierCode: panierCode,
      orderId: orderId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation échouée",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la création de la commande",
    });
  }
};

// Get all orders (admin only)
export const getOrders: RequestHandler = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const apiOrders = await Promise.all(
      (orders || []).map((order) => dbOrderToApi(order))
    );

    res.status(200).json({
      success: true,
      orders: apiOrders,
      count: apiOrders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get order by panier code
export const getOrderByPanierCode: RequestHandler = async (req, res) => {
  try {
    const { panierCode } = req.params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("panier_code", panierCode.toUpperCase())
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    const apiOrder = await dbOrderToApi(order);

    res.status(200).json({
      success: true,
      order: apiOrder,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// Get order by ID
export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    const apiOrder = await dbOrderToApi(order);

    res.status(200).json({
      success: true,
      order: apiOrder,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// Search orders by customer
export const searchOrders: RequestHandler = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    const searchTerm = query.toLowerCase();

    // Use multiple queries and combine results (Supabase doesn't support complex OR with ilike easily)
    const [panierRes, nameRes, emailRes, phoneRes] = await Promise.all([
      supabase.from("orders").select("*").ilike("panier_code", `%${searchTerm}%`),
      supabase.from("orders").select("*").ilike("customer_name", `%${searchTerm}%`),
      supabase.from("orders").select("*").ilike("customer_email", `%${searchTerm}%`),
      supabase.from("orders").select("*").ilike("customer_phone", `%${searchTerm}%`),
    ]);

    // Check for errors
    const error = panierRes.error || nameRes.error || emailRes.error || phoneRes.error;
    if (error) throw error;

    // Combine unique orders
    const orderMap = new Map();
    [panierRes.data, nameRes.data, emailRes.data, phoneRes.data].forEach((ordersList) => {
      ordersList?.forEach((order) => {
        if (!orderMap.has(order.id)) {
          orderMap.set(order.id, order);
        }
      });
    });

    const orders = Array.from(orderMap.values());

    if (error) throw error;

    const apiOrders = await Promise.all(
      (orders || []).map((order) => dbOrderToApi(order))
    );

    res.status(200).json({
      success: true,
      results: apiOrders,
      count: apiOrders.length,
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search orders",
    });
  }
};

// Update order status
export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["en attente", "en cours", "livré", "annulé"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    const apiOrder = await dbOrderToApi(order);

    res.status(200).json({
      success: true,
      message: "Status de la commande mis à jour",
      order: apiOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// Get orders by status
export const getOrdersByStatus: RequestHandler = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ["en attente", "en cours", "livré", "annulé"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const apiOrders = await Promise.all(
      (orders || []).map((order) => dbOrderToApi(order))
    );

    res.status(200).json({
      success: true,
      orders: apiOrders,
      count: apiOrders.length,
    });
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
