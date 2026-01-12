import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import {
  sendQuoteRequestConfirmationEmail,
  sendQuoteRequestAdminNotificationEmail,
} from "../lib/email.js";

// Validation schema for quote request
const quoteRequestSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  clientEmail: z.string().trim().email("L'adresse email n'est pas valide"),
  productId: z.string().min(1, "ID du produit requis"),
  productName: z
    .string()
    .trim()
    .min(1, "Le nom du produit est requis"),
  message: z
    .string()
    .trim()
    .optional()
    .default(""),
});

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  productId: string;
  productName: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: Date;
}

// Create quote request
export async function createQuoteRequest(req: any, res: any) {
  try {
    // Validate request body
    const validatedData = quoteRequestSchema.parse(req.body);

    // Generate quote request ID
    const quoteId = `quote_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    // Insert quote request into database
    const { data: quote, error: insertError } = await supabase
      .from("quote_requests")
      .insert({
        id: quoteId,
        client_name: validatedData.clientName,
        client_email: validatedData.clientEmail,
        product_id: validatedData.productId,
        product_name: validatedData.productName,
        message: validatedData.message,
        status: "new",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Send confirmation email to client
    await sendQuoteRequestConfirmationEmail(
      validatedData.clientEmail,
      validatedData.clientName,
      validatedData.productName,
    );

    // Send notification email to admin
    await sendQuoteRequestAdminNotificationEmail(
      validatedData.clientName,
      validatedData.clientEmail,
      validatedData.productName,
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: "Demande de devis créée avec succès",
      quoteId: quoteId,
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

    console.error("Quote request error:", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la création de la demande de devis",
    });
  }
}

// Get all quote requests (admin only)
export async function getQuoteRequests(req: any, res: any) {
  try {
    const { data: quotes, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const apiQuotes = (quotes || []).map((quote) => ({
      id: quote.id,
      clientName: quote.client_name,
      clientEmail: quote.client_email,
      productId: quote.product_id,
      productName: quote.product_name,
      message: quote.message,
      status: quote.status,
      createdAt: new Date(quote.created_at),
    }));

    res.status(200).json({
      success: true,
      quotes: apiQuotes,
      count: apiQuotes.length,
    });
  } catch (error) {
    console.error("Error fetching quote requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote requests",
    });
  }
}

// Get quote request by ID
export async function getQuoteRequestById(req: any, res: any) {
  try {
    const { id } = req.params;

    const { data: quote, error } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !quote) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    const apiQuote = {
      id: quote.id,
      clientName: quote.client_name,
      clientEmail: quote.client_email,
      productId: quote.product_id,
      productName: quote.product_name,
      message: quote.message,
      status: quote.status,
      createdAt: new Date(quote.created_at),
    };

    res.status(200).json({
      success: true,
      quote: apiQuote,
    });
  } catch (error) {
    console.error("Error fetching quote request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote request",
    });
  }
}

// Update quote request status
export async function updateQuoteRequestStatus(req: any, res: any) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["new", "read", "responded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const { data: quote, error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !quote) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    const apiQuote = {
      id: quote.id,
      clientName: quote.client_name,
      clientEmail: quote.client_email,
      productId: quote.product_id,
      productName: quote.product_name,
      message: quote.message,
      status: quote.status,
      createdAt: new Date(quote.created_at),
    };

    res.status(200).json({
      success: true,
      message: "Quote request status updated",
      quote: apiQuote,
    });
  } catch (error) {
    console.error("Error updating quote request status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update quote request status",
    });
  }
}

// Delete quote request
export async function deleteQuoteRequest(req: any, res: any) {
  try {
    const { id } = req.params;

    // Check if quote request exists
    const { data: quote, error: checkError } = await supabase
      .from("quote_requests")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !quote) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    // Delete quote request
    const { error: deleteError } = await supabase
      .from("quote_requests")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.status(200).json({
      success: true,
      message: "Quote request deleted",
      id,
    });
  } catch (error) {
    console.error("Error deleting quote request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete quote request",
    });
  }
}
