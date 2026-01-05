import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  slug?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  images = [],
  category,
  slug,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Use images array if available, otherwise create array from image prop
  const productImages = images.length > 0 ? images : image ? [image] : [];
  const currentImage = productImages[currentImageIndex] || image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      addItem({
        id,
        name,
        price,
        quantity: 1,
        slug: slug || id,
      });
      setIsAdded(true);
      toast.success(`${name} ajouté au panier`);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  const handleCardClick = () => {
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
      {/* Image Container */}
      <div className="product-image-container relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center h-72">
        <img
          src={currentImage}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Image Navigation Arrows - Show only on hover with multiple images */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="product-nav-arrow absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
              title="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="product-nav-arrow absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
              title="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {currentImageIndex + 1} / {productImages.length}
            </div>
          </>
        )}
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
        <div className="flex gap-3 pt-4 space-y-0">
          {/* Add to Cart Icon Button */}
          <button
            onClick={handleAddToCart}
            title={isAdded ? "Ajouté !" : "Ajouter au panier"}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-futura font-semibold ${
              isAdded
                ? "bg-accent/90 scale-95 text-white"
                : "bg-accent hover:bg-accent/90 active:scale-95 text-white shadow-md hover:shadow-lg"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          {/* View Product Icon Button */}
          <button
            onClick={handleViewProduct}
            title="Voir le produit"
            className="flex-1 py-3 px-4 rounded-lg border-2 border-foreground text-foreground hover:bg-foreground hover:text-white transition-all duration-300 flex items-center justify-center font-futura font-semibold shadow-sm hover:shadow-md active:scale-95"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
