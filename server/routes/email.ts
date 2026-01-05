import { RequestHandler } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";
import { ContactFormData, ContactFormResponse } from "@shared/api";

// Validation schema matching client-side validation
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Invalid name")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in name"),
  email: z.string().email("Invalid email").max(255, "Email too long"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number")
    .min(10, "Phone number too short"),
  subject: z
    .string()
    .min(3, "Subject too short")
    .max(200, "Subject too long"),
  message: z
    .string()
    .min(10, "Message too short")
    .max(5000, "Message too long"),
});

/**
 * Creates a nodemailer transporter with Gmail SMTP
 * Requires environment variables:
 * - EMAIL_USER: Gmail address
 * - EMAIL_APP_PASSWORD: Gmail App Password (not regular password)
 */
function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.warn(
      "Email credentials not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD environment variables."
    );
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

/**
 * Sanitizes user input to prevent any potential injection attacks
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .substring(0, 5000); // Limit length
}

export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validationResult = contactFormSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed: " + validationResult.error.errors[0].message,
      } as ContactFormResponse);
    }

    const data = validationResult.data as ContactFormData;

    // Create transporter
    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Please try again later.",
      } as ContactFormResponse);
    }

    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      phone: sanitizeInput(data.phone),
      subject: sanitizeInput(data.subject),
      message: sanitizeInput(data.message),
    };

    // Prepare email content
    const emailContent = `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom:</strong> ${sanitizedData.name}</p>
      <p><strong>Email:</strong> ${sanitizedData.email}</p>
      <p><strong>Téléphone:</strong> ${sanitizedData.phone}</p>
      <p><strong>Sujet:</strong> ${sanitizedData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedData.message.replace(/\n/g, "<br>")}</p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@luxence.fr",
      to: "itsazizsaidi@gmail.com",
      replyTo: sanitizedData.email,
      subject: `Nouveau message de contact: ${sanitizedData.subject}`,
      html: emailContent,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    } as ContactFormResponse);
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the email. Please try again later.",
    } as ContactFormResponse);
  }
};
