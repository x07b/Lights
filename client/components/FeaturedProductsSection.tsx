import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useState } from "react";

const products = [
  {
    id: "led-panel-light",
    name: "LED Frameless Panel Light",
    description: "Panneau LED encastrable, design minimaliste et haute performance lumineuse.",
    price: 49.00,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2Fff2a6753fb754ad38342a3f05b4cd636?format=webp&width=800",
    category: "Panneaux LED",
    slug: "led-frameless-panel",
  },
];

export function FeaturedProductsSection() {
  const [isAdded, setIsAdded] = useState(false);
  const product = products[0];

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-white via-[#FFF8F9] to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <p className="text-sm uppercase tracking-widest text-[#F97338] font-roboto font-semibold mb-4">
            ✨ Collection Phare
          </p>
          <h2 className="text-4xl md:text-6xl font-futura font-bold text-[#15203C] mb-4">
            Nos luminaires emblématiques
          </h2>
          <p className="text-lg text-gray-600 font-roboto max-w-2xl mx-auto">
            Découvrez notre sélection de luminaires les plus prisés, conçus pour sublimer vos espaces
          </p>
        </div>

        {/* Featured Product Showcase */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* Product Image */}
            <div className="h-96 md:h-full min-h-96 bg-[#FFF8F9] flex items-center justify-center p-8 md:p-12 overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Product Details */}
            <div className="p-8 md:p-12 flex flex-col justify-between h-full">
              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block bg-[#FFF8F9] text-[#F97338] px-4 py-2 rounded-full text-xs uppercase tracking-widest font-roboto font-semibold">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h3 className="text-3xl md:text-4xl font-futura font-bold text-[#15203C] mb-4 leading-tight">
                  {product.name}
                </h3>
                <p className="text-lg text-gray-600 font-roboto leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#F97338] rounded-full"></div>
                  <span className="text-sm text-gray-700 font-roboto">Longue durée de vie : 3000 heures</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#F97338] rounded-full"></div>
                  <span className="text-sm text-gray-700 font-roboto">Haute performance lumineuse : 1200 lm</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#F97338] rounded-full"></div>
                  <span className="text-sm text-gray-700 font-roboto">Design minimaliste encastrable</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-roboto mb-2">À partir de</p>
                <p className="text-5xl font-futura font-bold text-[#15203C]">
                  {product.price.toFixed(2)} <span className="text-2xl">TND</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-lg font-roboto font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-[#e66428] scale-95"
                      : "bg-[#F97338] hover:bg-[#e66428] active:scale-95"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdded ? "Ajouté au panier !" : "Ajouter au panier"}
                </button>

                <Link
                  to={`/product/${product.slug}`}
                  className="w-full py-4 px-6 rounded-lg font-roboto font-semibold text-[#15203C] border-2 border-[#15203C] hover:bg-[#FFF8F9] transition-colors duration-300 flex items-center justify-center gap-2 group"
                >
                  Voir les détails complets
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
