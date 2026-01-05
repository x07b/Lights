import { Order } from "@shared/api";

// In-memory store for orders
// In production, this should be replaced with a proper database
let orders: Order[] = [];

/**
 * Generate unique panier code
 * Format: PANIER-YYYYMMDD-RANDOMCODE
 */
export function generatePanierCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
  const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `PANIER-${dateStr}-${randomCode}`;
}

/**
 * Create a new order
 */
export function createOrder(
  panierCode: string,
  customerName: string,
  email: string,
  phone: string,
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[]
): Order {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order: Order = {
    panierCode,
    customerName,
    email,
    phone,
    products: cartItems,
    totalPrice,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  orders.push(order);
  return order;
}

/**
 * Get order by panier code
 */
export function getOrderByPanierCode(panierCode: string): Order | undefined {
  return orders.find((order) => order.panierCode === panierCode);
}

/**
 * Search orders by customer info
 */
export function searchOrders(query: string): Order[] {
  const lowerQuery = query.toLowerCase();
  return orders.filter(
    (order) =>
      order.panierCode.toLowerCase().includes(lowerQuery) ||
      order.customerName.toLowerCase().includes(lowerQuery) ||
      order.email.toLowerCase().includes(lowerQuery) ||
      order.phone.includes(query)
  );
}

/**
 * Get all orders
 */
export function getAllOrders(): Order[] {
  return [...orders];
}

/**
 * Update order status
 */
export function updateOrderStatus(
  panierCode: string,
  status: Order["status"]
): Order | undefined {
  const order = orders.find((o) => o.panierCode === panierCode);
  if (order) {
    order.status = status;
  }
  return order;
}
