import { useState, useEffect } from "react";
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
import { Loader2, Trash2, Edit2, X } from "lucide-react";
import { Collection } from "@shared/api";

const collectionSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  image: z
    .string()
    .url("L'image doit être une URL valide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères"),
  slug: z
    .string()
    .min(2, "Le slug doit contenir au least 2 caractères")
    .max(100, "Le slug ne peut pas dépasser 100 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets"
    ),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

export default function AdminCollections() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      slug: "",
    },
  });

  // Fetch collections
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/collections");
      const data = await response.json();

      if (data.success) {
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Erreur lors du chargement des collections");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: CollectionFormValues) {
    setIsSubmitting(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `/api/collections/${editingId}`
        : "/api/collections";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingId
            ? "Collection modifiée avec succès!"
            : "Collection créée avec succès!"
        );
        form.reset();
        setEditingId(null);
        fetchCollections();
      } else {
        toast.error(data.message || "Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = (collection: Collection) => {
    setEditingId(collection.id);
    form.reset({
      name: collection.name,
      description: collection.description,
      image: collection.image,
      slug: collection.slug,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette collection?")) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Collection supprimée avec succès!");
        fetchCollections();
      } else {
        toast.error(data.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-futura font-bold text-primary mb-2">
              Collections
            </h1>
            <p className="text-muted-foreground font-roboto">
              Créer et gérer vos collections
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-futura font-bold text-primary mb-6">
                  {editingId
                    ? "Modifier la collection"
                    : "Créer une nouvelle collection"}
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
                            Nom de la collection
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Panneaux LED"
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
                              placeholder="Description de la collection..."
                              className="border-border min-h-32 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              placeholder="panneaux-led"
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

                    <div className="flex gap-3 pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-futura font-bold py-3 flex items-center justify-center gap-2"
                      >
                        {isSubmitting && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {isSubmitting
                          ? "Traitement..."
                          : editingId
                            ? "Modifier"
                            : "Créer"}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </Card>
            </div>

            {/* Collections List */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-futura font-bold text-primary mb-4">
                  Collections ({collections.length})
                </h2>

                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chargement...
                  </div>
                ) : collections.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {collections.map((collection) => (
                      <div
                        key={collection.id}
                        className="p-3 bg-secondary rounded border border-border"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-futura font-bold text-primary text-sm">
                              {collection.name}
                            </h4>
                            <p className="text-xs text-muted-foreground font-roboto line-clamp-2">
                              {collection.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(collection)}
                            className="flex-1 p-1 hover:bg-accent/10 rounded text-accent transition text-xs font-roboto font-semibold flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(collection.id)}
                            className="flex-1 p-1 hover:bg-destructive/10 rounded text-destructive transition text-xs font-roboto font-semibold flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-roboto text-center py-8">
                    Aucune collection
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
