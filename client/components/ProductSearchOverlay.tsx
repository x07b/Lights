import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";

interface Product {
  id: string;
  name: string;
  slug: string;
  category?: string;
  price: number;
  image: string;
}

interface ProductSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
}

export function ProductSearchOverlay({
  isOpen,
  onClose,
  products = [],
}: ProductSearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );

    setResults(filtered);
  }, [searchQuery, products]);

  const handleSelectProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    onClose();
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Input
              autoFocus
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus:ring-0 text-lg p-0 h-auto"
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded text-muted-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.trim() ? (
            results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="w-full text-left p-4 hover:bg-secondary transition flex items-center gap-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-futura font-bold text-primary truncate">
                        {product.name}
                      </h4>
                      {product.category && (
                        <p className="text-xs text-muted-foreground font-roboto">
                          {product.category}
                        </p>
                      )}
                      <p className="text-accent font-futura font-bold">
                        {product.price.toFixed(2)} TND
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground font-roboto">
                Aucun produit trouvé
              </div>
            )
          ) : (
            <div className="p-8 text-center text-muted-foreground font-roboto">
              Commencez à taper pour rechercher
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
