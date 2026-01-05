import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ContactFormResponse } from "@shared/api";
import { Loader2 } from "lucide-react";

// Zod schema for validation - prevents SQL injection
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .regex(/^[a-zA-Z\s'-]+$/, "Le nom ne peut contenir que des lettres"),
  email: z
    .string()
    .email("Veuillez entrer une adresse email valide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z
    .string()
    .regex(
      /^[\d\s\-\+\(\)]+$/,
      "Veuillez entrer un numéro de téléphone valide"
    )
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  subject: z
    .string()
    .min(3, "Le sujet doit contenir au moins 3 caractères")
    .max(200, "Le sujet ne peut pas dépasser 200 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data: ContactFormResponse = await response.json();

      if (data.success) {
        toast.success("Email envoyé avec succès!");
        form.reset();
      } else {
        toast.error(data.message || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Une erreur est survenue lors de l'envoi de l'email");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-roboto">
                    Nom complet
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre nom"
                      className="border-border focus:border-accent focus:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-roboto">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      className="border-border focus:border-accent focus:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-roboto">
                    Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+33 (0) 1 23 45 67 89"
                      className="border-border focus:border-accent focus:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-roboto">
                    Sujet
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sujet de votre message"
                      className="border-border focus:border-accent focus:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-roboto">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Votre message..."
                    className="border-border focus:border-accent focus:ring-accent min-h-48 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-futura font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
