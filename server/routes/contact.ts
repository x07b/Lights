import { z } from "zod";
import { supabase } from "../lib/supabase";

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  email: z.string().trim().email("L'adresse email n'est pas valide"),
  subject: z
    .string()
    .trim()
    .min(3, "Le sujet doit contenir au moins 3 caractères")
    .max(200, "Le sujet ne doit pas dépasser 200 caractères"),
  message: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000, "Le message ne doit pas dépasser 5000 caractères"),
});

export async function handleContact(req: any, res: any) {
  try {
    // Validate request body
    const validatedData = contactFormSchema.parse(req.body) as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    // Generate message ID
    const messageId = `msg_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    // Insert message into database
    const { data: message, error: insertError } = await supabase
      .from("contact_messages")
      .insert({
        id: messageId,
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: "new",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Try to send email if SMTP is configured
    const emailSent = await sendEmail(validatedData);

    // Return success response with email delivery status
    res.status(200).json({
      success: true,
      message: emailSent
        ? "Message envoyé avec succès et email notification reçue"
        : "Message reçu avec succès (email de notification en attente de configuration)",
      messageId: messageId,
      emailSent: emailSent,
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

    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'envoi du message",
    });
  }
};

// Email sending function
async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  // Check if email service is configured
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log("Email service not configured, message stored in system");
    return false;
  }

  try {
    // Dynamically import nodemailer only when needed (optional dependency)
    // @ts-ignore - nodemailer is optional, type check disabled
    const nodemailer = await import("nodemailer").catch(() => null);
    
    if (!nodemailer) {
      console.log("nodemailer not available, skipping email send");
      return false;
    }

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "itsazizsaidi@gmail.com",
      subject: `Nouveau message de contact: ${data.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>De:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Sujet:</strong> ${escapeHtml(data.subject)}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
      `,
      replyTo: data.email,
    });

    console.log("Email sent successfully to admin");
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw error, just log it - message is already stored
    return false;
  }
}

// Helper function to escape HTML special characters (XSS prevention)
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Get all contact messages (admin only)
export const getContactMessages: RequestHandler = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Convert to API format (matching the old format)
    const apiMessages = (messages || []).map((msg) => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      timestamp: new Date(msg.created_at),
      status: msg.status,
    }));

    res.status(200).json(apiMessages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
};

// Mark message as read
export const markMessageAsRead: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: message, error } = await supabase
      .from("contact_messages")
      .update({ status: "read" })
      .eq("id", id)
      .select()
      .single();

    if (error || !message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
    });
  }
};
