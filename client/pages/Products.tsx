import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "../components/ProductCard";

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

export default function Products() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header Section */}
        <div className="mb-16 md:mb-20 space-y-6 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-roboto font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour à l'accueil
          </Link>

          <div className="space-y-4">
            <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
              Notre Catalogue
            </p>
            <h1 className="text-5xl md:text-6xl font-futura font-bold text-foreground leading-tight">
              Nos Produits
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-2xl leading-relaxed">
              Découvrez notre collection complète de luminaires haut de gamme,
              conçus pour sublimer vos espaces avec élégance et performance.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in opacity-0"
                style={{
                  animation: `fade-in 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <ProductCard {...product} images={product.images} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground font-roboto mb-6">
              Aucun produit disponible pour le moment
            </p>
            <p className="text-sm text-muted-foreground font-roboto">
              Veuillez consulter à nouveau plus tard ou contacter l'administrateur
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 pt-16 border-t border-border">
          <div className="text-center space-y-6 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-futura font-bold text-foreground">
              Vous cherchez quelque chose de spécifique ?
            </h3>
            <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
              Contactez notre équipe d'experts pour bénéficier de conseils
              personnalisés
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-futura font-bold rounded-lg hover:bg-accent/90 transition-all duration-300 hover:shadow-lg active:scale-95 group"
            >
              Nous contacter
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
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
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
