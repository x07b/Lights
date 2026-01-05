import { RequestHandler } from "express";
import { z } from "zod";

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

// Store orders in memory (replace with database in production)
export const orders: Order[] = [];

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

    // Create order object
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      panierCode: generatePanierCode(),
      customer: validatedData.customer,
      items: validatedData.items,
      total: validatedData.total,
      status: "en attente",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store the order
    orders.push(order);

    // Return success response with panier code
    res.status(201).json({
      success: true,
      message: "Commande créée avec succès",
      panierCode: order.panierCode,
      orderId: order.id,
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
export const getOrders: RequestHandler = (req, res) => {
  // In production, add proper authentication check
  res.status(200).json({
    success: true,
    orders: orders,
    count: orders.length,
  });
};

// Get order by panier code
export const getOrderByPanierCode: RequestHandler = (req, res) => {
  const { panierCode } = req.params;

  const order = orders.find(
    (o) => o.panierCode.toUpperCase() === panierCode.toUpperCase(),
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Commande non trouvée",
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
};

// Get order by ID
export const getOrderById: RequestHandler = (req, res) => {
  const { id } = req.params;

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Commande non trouvée",
    });
  }

  res.status(200).json({
    success: true,
    order,
  });
};

// Search orders by customer
export const searchOrders: RequestHandler = (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({
      success: false,
      message: "Query parameter is required",
    });
  }

  const searchTerm = query.toLowerCase();
  const results = orders.filter(
    (order) =>
      order.panierCode.toLowerCase().includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm) ||
      order.customer.email.toLowerCase().includes(searchTerm) ||
      order.customer.phone.includes(searchTerm),
  );

  res.status(200).json({
    success: true,
    results,
    count: results.length,
  });
};

// Update order status
export const updateOrderStatus: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["en attente", "en cours", "livré", "annulé"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Commande non trouvée",
    });
  }

  order.status = status;
  order.updatedAt = new Date();

  res.status(200).json({
    success: true,
    message: "Status de la commande mis à jour",
    order,
  });
};

// Get orders by status
export const getOrdersByStatus: RequestHandler = (req, res) => {
  const { status } = req.params;

  const validStatuses = ["en attente", "en cours", "livré", "annulé"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const filtered = orders.filter((o) => o.status === status);

  res.status(200).json({
    success: true,
    orders: filtered,
    count: filtered.length,
  });
};
