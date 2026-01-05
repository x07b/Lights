import { useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { Order } from "@shared/api";

export default function AdminSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/orders/search?query=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      if (data.success && data.orders) {
        setSearchResults(data.orders);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching orders:", error);
      setSearchResults([]);
    }

    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-futura font-bold text-primary mb-2">
              Rechercher une commande
            </h1>
            <p className="text-muted-foreground font-roboto">
              Recherchez par code panier, nom client, email ou téléphone
            </p>
          </div>

          {/* Search Box */}
          <Card className="p-8 mb-8">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Code panier, nom, email ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-border"
              />
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground font-roboto">
                    {searchResults.length} résultat(s) trouvé(s)
                  </p>

                  {searchResults.map((order) => (
                    <Card key={order.panierCode} className="overflow-hidden">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.panierCode
                              ? null
                              : order.panierCode,
                          )
                        }
                        className="w-full p-6 hover:bg-secondary transition text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-futura font-bold text-primary mb-2">
                              {order.customerName}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground font-roboto">
                                  Code Panier
                                </p>
                                <p className="font-futura font-bold text-accent">
                                  {order.panierCode}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-roboto">
                                  Email
                                </p>
                                <p className="font-roboto text-sm">
                                  {order.email}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-roboto">
                                  Téléphone
                                </p>
                                <p className="font-roboto text-sm">
                                  {order.phone}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-roboto">
                                  Montant
                                </p>
                                <p className="font-futura font-bold text-primary">
                                  {order.totalPrice.toFixed(2)} TND
                                </p>
                              </div>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              expandedOrder === order.panierCode
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </button>

                      {expandedOrder === order.panierCode && (
                        <div className="border-t border-border p-6 bg-secondary">
                          <h4 className="font-futura font-bold text-primary mb-4">
                            Produits commandés
                          </h4>
                          <div className="space-y-3">
                            {order.products.map((product, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white rounded border border-border"
                              >
                                <div>
                                  <p className="font-futura font-bold text-primary">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground font-roboto">
                                    Quantité: {product.quantity}
                                  </p>
                                </div>
                                <p className="font-futura font-bold text-accent">
                                  {(product.price * product.quantity).toFixed(
                                    2,
                                  )}{" "}
                                  TND
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex items-center justify-between mb-4">
                              <p className="font-roboto text-muted-foreground">
                                Statut
                              </p>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-futura font-bold ${
                                  order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {order.status === "pending"
                                  ? "En attente"
                                  : order.status === "confirmed"
                                    ? "Confirmée"
                                    : order.status === "shipped"
                                      ? "Expédiée"
                                      : "Livrée"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="font-roboto text-muted-foreground">
                                Date de commande
                              </p>
                              <p className="font-roboto text-sm">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground font-roboto text-lg">
                    Aucune commande trouvée pour cette recherche.
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
