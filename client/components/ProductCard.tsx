import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../hooks/useCart";

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
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      image,
    });
    setIsAdded(true);
    toast.success(`${name} ajouté au panier!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleCardClick = () => {
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer"
    >
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
        <h3 className="text-xl font-futura font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {name}
        </h3>

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

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          title={isAdded ? "Ajouté !" : "Ajouter au panier"}
          className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-futura font-semibold ${
            isAdded
              ? "bg-accent/90 scale-95 text-white"
              : "bg-accent hover:bg-accent/90 active:scale-95 text-white shadow-md hover:shadow-lg"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isAdded ? "Ajouté !" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
