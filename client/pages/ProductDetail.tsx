import { useState, useEffect } from "react";
import {
  Download,
  Zap,
  Sun,
  Lightbulb,
  RotateCcw,
  Trash2,
  Leaf,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
  specifications: Specification[];
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setMainImageIndex(0);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 animate-fade-in">
          <p className="font-roboto text-lg text-muted-foreground">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="font-futura text-5xl font-bold text-foreground">
            Produit non trouvé
          </h1>
          <p className="font-roboto text-lg text-muted-foreground">
            Le produit que vous recherchez n'existe pas.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-roboto font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    // For now, products fetched from API don't have PDF files
    alert("PDF download not available for this product");
  };

  const specifications = product.specifications;

  const certifications = [
    { icon: "RoHS", label: "RoHS" },
    { icon: "Recyclable", label: "Recyclable" },
    { icon: "CE", label: "CE" },
    { icon: "NoDisposal", label: "Ne pas jeter à la poubelle" },
  ];

  const advantages = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Longue durée de vie",
      description: "3000 heures de fonctionnement optimal",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Économie d'énergie",
      description: "Technologie LED performante et durable",
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Haute luminosité",
      description: "1200 lm pour un éclairage puissant et uniforme",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-white to-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300 font-roboto font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Retour aux produits
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Product Images Gallery */}
            <div className="product-gallery space-y-4">
              <div className="flex items-center justify-center bg-white rounded-2xl p-8 sm:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border animate-fade-in">
                <div className="relative w-full">
                  <img
                    src={product.images[mainImageIndex]}
                    alt={product.name}
                    className="w-full h-auto max-w-md object-cover rounded-lg hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl -z-10 blur-xl" />
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="thumbnail-container flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                        mainImageIndex === index
                          ? "border-accent shadow-lg"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <p className="font-roboto text-sm uppercase tracking-widest text-accent font-semibold">
                  {product.category}
                </p>
                <h1 className="font-futura text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
                <p className="font-roboto text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specs */}
              <div className="border-t border-b border-border py-8 space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="font-roboto text-muted-foreground">
                    Puissance
                  </span>
                  <span className="font-roboto font-semibold text-foreground text-lg group-hover:text-accent transition-colors duration-300">
                    {
                      product.specifications.find(
                        (s) => s.label === "Puissance",
                      )?.value
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-roboto text-muted-foreground">
                    Type
                  </span>
                  <span className="font-roboto font-semibold text-foreground text-lg group-hover:text-accent transition-colors duration-300">
                    {
                      product.specifications.find((s) => s.label === "Type")
                        ?.value
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="font-roboto text-muted-foreground">
                    Flux lumineux
                  </span>
                  <span className="font-roboto font-semibold text-foreground text-lg group-hover:text-accent transition-colors duration-300">
                    {
                      product.specifications.find(
                        (s) => s.label === "Flux lumineux",
                      )?.value
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="font-roboto font-bold text-foreground">
                    Prix
                  </span>
                  <span className="font-futura font-bold text-accent text-3xl">
                    {product.price.toFixed(2)} TND
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-accent hover:bg-accent/90 text-white font-roboto font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Télécharger la fiche technique
                </button>
                <button
                  title="Ajouter au panier"
                  className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-white p-3 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
            <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
              Caractéristiques
            </p>
            <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
              Avantages clés
            </h2>
            <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
              Découvrez ce qui fait l'excellence de ce luminaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="group text-center space-y-6 p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border animate-fade-in opacity-0"
                style={{
                  animation: `fade-in 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full flex items-center justify-center text-accent group-hover:bg-accent/20 transition-all duration-300">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="font-futura text-xl font-bold text-foreground">
                  {advantage.title}
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
            <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
              Détails techniques
            </p>
            <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
              Caractéristiques techniques
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="p-8 hover:bg-accent/2 transition-colors duration-300 group"
                >
                  <div className="flex justify-between items-center md:flex-col md:items-start gap-4">
                    <p className="font-roboto text-muted-foreground font-medium">
                      {spec.label}
                    </p>
                    <p className="font-roboto font-bold text-foreground text-lg group-hover:text-accent transition-colors duration-300">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Icons Section */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
            <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest">
              Normes & Standards
            </p>
            <h2 className="font-futura text-4xl md:text-5xl font-bold text-foreground">
              Certifications et conformité
            </h2>
            <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
              Tous nos produits respectent les normes les plus strictes en
              matière de qualité et d'environnement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="w-12 h-12" />,
                label: "RoHS",
              },
              {
                icon: <RotateCcw className="w-12 h-12" />,
                label: "Recyclable",
              },
              {
                icon: <Lightbulb className="w-12 h-12" />,
                label: "CE",
              },
              {
                icon: <Trash2 className="w-12 h-12" />,
                label: "Ne pas jeter",
              },
            ].map((cert, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group animate-fade-in opacity-0"
                style={{
                  animation: `fade-in 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                  {cert.icon}
                </div>
                <p className="font-roboto text-sm font-semibold text-foreground text-center group-hover:text-accent transition-colors duration-300">
                  {cert.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-r from-foreground to-foreground/95">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="font-futura text-4xl md:text-5xl font-bold text-white leading-tight">
            Prêt à illuminer vos espaces avec style ?
          </h2>
          <p className="font-roboto text-lg text-white/85 leading-relaxed">
            Découvrez la performance et l'élégance du {product.name}. Notre
            équipe d'experts est prête à vous conseiller.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-white font-roboto font-bold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 group"
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
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-roboto font-bold rounded-lg border-2 border-white/30 transition-all duration-300 group"
            >
              Voir d'autres produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
