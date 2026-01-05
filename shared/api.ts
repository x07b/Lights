/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form request type
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/**
 * Contact form response type
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
}

/**
 * Order/Panier data type
 */
export interface Order {
  panierCode: string;
  customerName: string;
  email: string;
  phone: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  createdAt: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
}

/**
 * Checkout request type
 */
export interface CheckoutData {
  customerName: string;
  email: string;
  phone: string;
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

/**
 * Checkout response type
 */
export interface CheckoutResponse {
  success: boolean;
  panierCode: string;
  message: string;
}

/**
 * Collection type
 */
export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  createdAt: string;
}

/**
 * Product with extended details
 */
export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  slug: string;
  collectionId?: string;
  images: string[];
  mainImage: string;
  technicalFile?: string;
  createdAt: string;
}
