import { ProductCard } from "./ProductCard";

const products = [
  {
    id: "led-panel-light",
    name: "LED Frameless Panel Light",
    description:
      "Panneau LED encastrable, design minimaliste et haute performance lumineuse.",
    price: 49.0,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F51c4ee0b186648aaa95eea0393361312?format=webp&width=800",
    category: "Panneaux LED",
    slug: "led-frameless-panel",
  },
  {
    id: "led-panel-light-round",
    name: "LED Panel Light Round",
    description:
      "Panneau LED encastrable rond, longue durée de vie et économe en énergie.",
    price: 49.0,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fcbe2eec5db404214a3a4db1cb75a5758%2Fb16ebe3730ac4e5f9a4fb71cf3ee89d5?format=webp&width=800",
    category: "Panneaux LED",
    slug: "led-panel-light-round",
  },
];

export function FeaturedProductsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-3 animate-fade-in">
          <p className="text-accent font-roboto text-xs md:text-sm font-semibold uppercase tracking-widest">
            Notre Collection
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-futura font-bold text-foreground mb-3 leading-tight">
            Nos luminaires emblématiques
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-roboto max-w-2xl mx-auto leading-relaxed">
            Découvrez nos luminaires les plus prisés
          </p>
        </div>

        {/* Products Grid */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in opacity-0"
                  style={{
                    animation: `fade-in 0.6s ease-out forwards`,
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className="flex justify-center mt-10 animate-fade-in opacity-0"
          style={{
            animation: `fade-in 0.6s ease-out forwards`,
            animationDelay: `${products.length * 150 + 200}ms`,
          }}
        >
          <a
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-white font-futura font-bold rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg active:scale-95 group text-sm md:text-base"
          >
            Voir tous nos produits
            <svg
              className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
