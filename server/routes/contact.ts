import { RequestHandler } from "express";
import { z } from "zod";

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

// Store messages in memory (replace with database in production)
export const contactMessages: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
  status: "new" | "read";
}> = [];

export const handleContact: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validatedData = contactFormSchema.parse(req.body);

    // Create message object with timestamp
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...validatedData,
      timestamp: new Date(),
      status: "new" as const,
    };

    // Store the message
    contactMessages.push(message);

    // Try to send email if SMTP is configured
    await sendEmail(validatedData);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Message envoyé avec succès",
      messageId: message.id,
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
}): Promise<void> {
  // Check if email service is configured
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log("Email service not configured, message stored in system");
    return;
  }

  try {
    const nodemailer = await import("nodemailer");

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
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw error, just log it - message is already stored
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
export const getContactMessages: RequestHandler = (req, res) => {
  // In production, add proper authentication check
  res.status(200).json(contactMessages);
};

// Mark message as read
export const markMessageAsRead: RequestHandler = (req, res) => {
  const { id } = req.params;

  const message = contactMessages.find((m) => m.id === id);
  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found",
    });
  }

  message.status = "read";
  res.status(200).json({
    success: true,
    message: "Message marked as read",
  });
};
