import { Link } from "react-router-dom";
import { ProductCard } from "./ProductCard";

const products = [
  {
    id: "led-panel-light",
    name: "LED Frameless Panel Light",
    description: "Panneau LED encastrable, design minimaliste et haute performance lumineuse.",
    price: 49.00,
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d782f?w=400&q=80",
    category: "Panneaux LED",
    slug: "led-frameless-panel",
  },
];

export function FeaturedProductsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-futura font-bold text-primary mb-4">
            Nos luminaires emblématiques
          </h2>
          <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Découvrez notre sélection des luminaires les plus prisés
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
