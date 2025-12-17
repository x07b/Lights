import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "../components/ProductCard";

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

export default function Products() {
  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-roboto font-semibold mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>

          <h1 className="text-4xl md:text-5xl font-futura font-bold text-primary mb-3">
            Nos Produits
          </h1>
          <p className="text-lg text-muted-foreground font-roboto">
            Découvrez notre collection complète de luminaires haut de gamme.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
