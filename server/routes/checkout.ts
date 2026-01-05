import { RequestHandler } from "express";
import { z } from "zod";
import { CheckoutData, CheckoutResponse } from "@shared/api";
import { generatePanierCode, createOrder } from "../data/orders";

// Validation schema
const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Invalid name")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in name"),
  email: z.string().email("Invalid email").max(255, "Email too long"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number")
    .min(10, "Phone number too short"),
  cartItems: z
    .array(
      z.object({
        id: z.string().min(1, "Invalid product id"),
        name: z.string().min(1, "Invalid product name"),
        price: z.number().positive("Invalid price"),
        quantity: z.number().int().positive("Invalid quantity"),
      }),
    )
    .min(1, "Cart cannot be empty"),
});

/**
 * Sanitizes user input to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 500);
}

export const handleCheckout: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validationResult = checkoutSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        panierCode: "",
        message:
          "Validation failed: " + validationResult.error.errors[0].message,
      } as CheckoutResponse);
    }

    const data = validationResult.data as CheckoutData;

    // Generate unique panier code
    const panierCode = generatePanierCode();

    // Sanitize inputs
    const sanitizedData = {
      customerName: sanitizeInput(data.customerName),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
    };

    // Create order in data store
    const order = createOrder(
      panierCode,
      sanitizedData.customerName,
      sanitizedData.email,
      sanitizedData.phone,
      data.cartItems,
    );

    // Log order for debugging (in production, would send to email/database)
    console.log("New order created:", {
      panierCode: order.panierCode,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      totalPrice: order.totalPrice,
      itemCount: order.products.length,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      panierCode,
      message: "Order created successfully. We will call you for verification.",
    } as CheckoutResponse);
  } catch (error) {
    console.error("Error processing checkout:", error);
    return res.status(500).json({
      success: false,
      panierCode: "",
      message:
        "An error occurred while processing your order. Please try again later.",
    } as CheckoutResponse);
  }
};
