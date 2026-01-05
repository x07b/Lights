import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AdminSidebar } from "../components/AdminSidebar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Loader2, Trash2 } from "lucide-react";

const productSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(200, "Le nom ne peut pas dépasser 200 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  price: z.coerce.number().positive("Le prix doit être positif"),
  category: z
    .string()
    .min(2, "La catégorie doit contenir au moins 2 caractères")
    .max(100, "La catégorie ne peut pas dépasser 100 caractères"),
  image: z
    .string()
    .url("L'image doit être une URL valide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères"),
  slug: z
    .string()
    .min(2, "Le slug doit contenir au moins 2 caractères")
    .max(100, "Le slug ne peut pas dépasser 100 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets",
    ),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Product extends ProductFormValues {
  id: string;
}

export default function AdminAddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem("admin-products");
    return stored ? JSON.parse(stored) : [];
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      slug: "",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    try {
      const newProduct: Product = {
        ...values,
        id: `product-${Date.now()}`,
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem("admin-products", JSON.stringify(updatedProducts));

      toast.success("Produit ajouté avec succès!");
      form.reset();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Une erreur est survenue lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts));
    toast.success("Produit supprimé avec succès!");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-futura font-bold text-primary mb-2">
              Gestion des produits
            </h1>
            <p className="text-muted-foreground font-roboto">
              Ajouter et gérer les produits de votre boutique
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Product Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-futura font-bold text-primary mb-6">
                  Ajouter un nouveau produit
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-roboto">
                            Nom du produit
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nom du produit"
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-roboto">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description du produit"
                              className="border-border min-h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-roboto">
                              Prix (TND)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
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
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-roboto">
                              Catégorie
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Catégorie"
                                className="border-border"
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
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-roboto">
                            URL slug
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="produit-nom"
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
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-roboto">
                            Image URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://..."
                              className="border-border"
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
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-futura font-bold py-3 flex items-center justify-center gap-2"
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {isSubmitting
                        ? "Ajout en cours..."
                        : "Ajouter le produit"}
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>

            {/* Products List */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-futura font-bold text-primary mb-4">
                  Produits ({products.length})
                </h2>

                {products.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 bg-secondary rounded border border-border"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-futura font-bold text-primary text-sm">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground font-roboto">
                              {product.price.toFixed(2)} TND
                            </p>
                            <p className="text-xs text-accent font-roboto">
                              {product.category}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-roboto text-center py-8">
                    Aucun produit ajouté
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
