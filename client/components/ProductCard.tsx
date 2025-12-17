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
    <div className="group cursor-pointer h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 p-6 flex items-center justify-center h-72">
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

        {/* Action Icons */}
        <div className="flex gap-3 pt-4">
          {/* Add to Cart Icon Button */}
          <button
            onClick={handleAddToCart}
            title={isAdded ? "Ajouté !" : "Ajouter au panier"}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
              isAdded
                ? "bg-[#e66428] scale-95"
                : "bg-[#F97338] hover:bg-[#e66428] active:scale-95"
            }`}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>

          {/* View Product Icon Button */}
          <button
            onClick={handleViewProduct}
            title="Voir le produit"
            className="flex-1 py-3 px-4 rounded-lg border-2 border-[#15203C] text-[#15203C] hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
