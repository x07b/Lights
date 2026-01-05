import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Trash2, ArrowLeft, Loader2, Phone } from "lucide-react";
import { CheckoutResponse } from "@shared/api";

const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Numéro de téléphone invalide")
    .min(10, "Le numéro doit contenir au moins 10 caractères"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, removeItem } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [panierCode, setPanierCode] = useState("");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
    },
  });

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-6">
              Votre panier est vide
            </h1>
            <p className="text-lg text-muted-foreground mb-8 font-roboto">
              Veuillez ajouter des produits avant de procéder au paiement.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuer les achats
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg border border-border p-12 mb-8">
              <div className="text-6xl mb-6">✓</div>
              <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-6">
                Commande confirmée !
              </h1>
              <p className="text-lg text-muted-foreground mb-8 font-roboto">
                Merci pour votre achat. Votre commande a été reçue et nous
                allons vous appeler pour la vérification.
              </p>

              <div className="bg-secondary rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-futura font-bold text-primary mb-4">
                  Votre code de panier
                </h2>
                <p className="text-4xl font-futura font-bold text-accent mb-6 break-all">
                  {panierCode}
                </p>
                <p className="text-muted-foreground font-roboto mb-6">
                  Veuillez conserver ce code pour votre dossier.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-futura font-bold text-blue-900 mb-2">
                      Support client
                    </h3>
                    <p className="text-blue-800 font-roboto">
                      Appelez-nous pour confirmer votre commande et les détails
                      de livraison :
                    </p>
                    <p className="text-2xl font-futura font-bold text-blue-600 mt-2">
                      +33 (0) 1 23 45 67 89
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(values: CheckoutFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          cartItems: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data: CheckoutResponse = await response.json();

      if (data.success) {
        setPanierCode(data.panierCode);
        setOrderCompleted(true);
        clearCart();
        toast.success("Commande créée avec succès!");
      } else {
        toast.error(
          data.message || "Erreur lors de la création de la commande",
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-12">
            Panier & Paiement
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-border p-8">
                <h2 className="text-2xl font-futura font-bold text-primary mb-6">
                  Résumé du panier
                </h2>

                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-futura font-bold text-primary">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm font-roboto">
                          Quantité: {item.quantity}
                        </p>
                        <p className="text-accent font-bold">
                          {(item.price * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded text-destructive transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/products")}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continuer les achats
                  </Button>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border p-8 sticky top-4">
                <h2 className="text-2xl font-futura font-bold text-primary mb-6">
                  Informations client
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-roboto">
                            Nom complet
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Votre nom"
                              className="border-border"
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
                              className="border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              placeholder="+33..."
                              className="border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-secondary rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground font-roboto mb-2">
                        Montant total
                      </p>
                      <p className="text-3xl font-futura font-bold text-accent">
                        {totalPrice.toFixed(2)} TND
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-futura font-bold py-3 flex items-center justify-center gap-2"
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {isSubmitting ? "Traitement..." : "Confirmer la commande"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
