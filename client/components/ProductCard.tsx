import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group cursor-pointer h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#FFF8F9] p-6 flex items-center justify-center h-72">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Category */}
        {category && (
          <p className="text-xs text-[#F97338] uppercase tracking-widest font-roboto font-semibold">
            {category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-xl font-futura font-bold text-[#15203C] line-clamp-2 group-hover:text-[#F97338] transition-colors duration-300">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 font-roboto line-clamp-1 flex-grow">
          {description}
        </p>

        {/* Price */}
        <div className="pt-2">
          <span className="text-2xl font-futura font-bold text-[#15203C]">
            {price.toFixed(2)} TND
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {/* Primary Button - Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-lg font-roboto font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              isAdded
                ? "bg-[#e66428] scale-95"
                : "bg-[#F97338] hover:bg-[#e66428] active:scale-95"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {isAdded ? "Ajouté !" : "Ajouter au panier"}
          </button>

          {/* Secondary Button - View Product */}
          <button
            className="w-full py-3 px-4 rounded-lg font-roboto font-semibold text-[#15203C] border-2 border-[#15203C] hover:bg-[#FFF8F9] transition-colors duration-300"
          >
            Voir le produit
          </button>
        </div>
      </div>
    </div>
  );
}
