import { ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  slug?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  slug,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  return (
    <div className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center h-72">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Category */}
        {category && (
          <p className="text-xs text-accent uppercase tracking-widest font-roboto font-semibold opacity-80">
            {category}
          </p>
        )}

        {/* Title */}
        {slug ? (
          <Link to={`/product/${slug}`} className="group/title">
            <h3 className="text-xl font-futura font-bold text-foreground line-clamp-2 group-hover/title:text-accent transition-colors duration-300 cursor-pointer">
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="text-xl font-futura font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-300">
            {name}
          </h3>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground font-roboto line-clamp-2 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Price */}
        <div className="pt-2 border-t border-border">
          <span className="text-2xl font-futura font-bold text-accent">
            {price.toFixed(2)} TND
          </span>
        </div>

        {/* Action Icons */}
        <div className="flex gap-3 pt-4">
          {/* View Product Icon Button */}
          <button
            onClick={handleViewProduct}
            title="Voir le produit"
            className="py-3 px-4 rounded-lg border-2 border-foreground text-foreground hover:bg-foreground hover:text-white transition-all duration-300 flex items-center justify-center font-futura font-semibold shadow-sm hover:shadow-md active:scale-95"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
