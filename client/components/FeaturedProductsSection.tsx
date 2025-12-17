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
];

export function FeaturedProductsSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-futura font-bold text-primary mb-3">
            Nos luminaires emblématiques
          </h2>
          <p className="text-base text-muted-foreground font-roboto max-w-2xl mx-auto">
            Découvrez notre sélection de luminaires les plus prisés
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
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
      </div>
    </section>
  );
}
