import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeroPanel } from "@/components/product/ProductHeroPanel";
import { ScrollToTop } from "@/components/ScrollToTop";

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
  pdfFile?: string;
  pdfFilename?: string;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="text-center">
          <p className="font-roboto text-lg text-muted-foreground animate-pulse">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white to-gray-50">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="font-futura text-4xl font-bold text-foreground">
            Produit non trouvé
          </h1>
          <p className="font-roboto text-muted-foreground">
            Le produit que vous recherchez n'existe pas.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-roboto font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Two-Column Hero Section: Gallery Left, Sticky Panel Right */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Left: Product Gallery (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Right: Sticky Product Info Panel (1 col) */}
          <div className="lg:col-span-1">
            <ProductHeroPanel
              category={product.category}
              name={product.name}
              description={product.description}
              pdfFile={product.pdfFile}
              pdfFilename={product.pdfFilename}
            />
          </div>
        </section>

        {/* Product Overview Section */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Description */}
            <div className="space-y-6">
              <div>
                <h2 className="font-futura text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Découvrez l'excellence en éclairage
                </h2>
                <p className="font-roboto text-lg text-muted-foreground leading-relaxed">
                  Le {product.name} représente le summum de la technologie d'éclairage moderne. Combinant performance énergétique, durabilité exceptionnelle et design minimaliste, ce luminaire transforme vos espaces en environnements lumineux sophistiqués.
                </p>
              </div>
              <div className="pt-6 border-t border-border">
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Conçu pour les professionnels et les particuliers exigeants, ce produit offre une solution complète d'éclairage avec contrôle intelligent, adaptabilité et fiabilité inégalées. Chaque détail a été pensé pour assurer votre satisfaction et optimiser votre investissement.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="font-futura text-2xl font-bold text-foreground mb-6">
                Caractéristiques principales
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <span className="text-accent font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-futura font-bold text-foreground mb-1">
                      Longévité supérieure
                    </h4>
                    <p className="font-roboto text-sm text-muted-foreground">
                      Durée de vie exceptionnelle de 3000+ heures avec performance constante
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <span className="text-accent font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-futura font-bold text-foreground mb-1">
                      Efficacité énergétique
                    </h4>
                    <p className="font-roboto text-sm text-muted-foreground">
                      Technologie LED haute performance réduisant votre consommation énergétique
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <span className="text-accent font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-futura font-bold text-foreground mb-1">
                      Design épuré
                    </h4>
                    <p className="font-roboto text-sm text-muted-foreground">
                      Esthétique minimaliste s'intégrant parfaitement à tout décor
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <span className="text-accent font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-futura font-bold text-foreground mb-1">
                      Contrôle intelligent
                    </h4>
                    <p className="font-roboto text-sm text-muted-foreground">
                      Compatible avec systèmes domotiques pour contrôle personnalisé
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <span className="text-accent font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-futura font-bold text-foreground mb-1">
                      Installation simple
                    </h4>
                    <p className="font-roboto text-sm text-muted-foreground">
                      Setup rapide et facile, support technique disponible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications Section */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <div className="space-y-6">
              <div>
                <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                  Spécifications techniques
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 border border-border"
                  >
                    <p className="font-roboto text-sm uppercase tracking-widest text-accent font-bold mb-2">
                      {spec.label}
                    </p>
                    <p className="font-futura text-2xl font-bold text-foreground">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section className="mb-16 sm:mb-20 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-8 sm:p-12">
          <div className="space-y-8">
            <div>
              <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                Pourquoi choisir ce produit ?
              </h2>
              <div className="h-1 w-20 bg-accent rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Performance garantie
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Nous garantissons la performance constante de ce luminaire avec une couverture complète et un support technique réactif. Votre investissement est protégé.
                </p>
              </div>
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Solution économique
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Réduisez vos coûts énergétiques tout en profitant d'une qualité d'éclairage supérieure. Amortissement rapide et rentabilité garantie.
                </p>
              </div>
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Respect de l'environnement
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Solution écologique et durable, recyclable et certifiée. Contribuez à la préservation de l'environnement sans compromis.
                </p>
              </div>
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Support expert
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Équipe d'experts disponible pour assistance, conseil et maintenance. Satisfaction client garantie à 100%.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="mb-16 sm:mb-20">
          <div className="space-y-6">
            <div>
              <h2 className="font-futura text-3xl font-bold text-foreground mb-2">
                Cas d'application
              </h2>
              <div className="h-1 w-20 bg-accent rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Espaces professionnels
                </h3>
                <p className="font-roboto text-muted-foreground">
                  Bureau, open space, salles de réunion. Créez un environnement productif et confortable pour vos équipes.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Espaces résidentiels
                </h3>
                <p className="font-roboto text-muted-foreground">
                  Salon, cuisine, chambre. Transformez votre habitat avec un éclairage adapté à votre style de vie.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Environnements commerciaux
                </h3>
                <p className="font-roboto text-muted-foreground">
                  Boutique, galerie, showroom. Mettez en valeur vos produits avec un éclairage professionnel et élégant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="font-futura text-3xl sm:text-4xl font-bold">
            Prêt à transformer votre éclairage ?
          </h2>
          <p className="font-roboto text-lg max-w-2xl mx-auto text-white/90">
            Contactez-nous dès maintenant pour obtenir un devis personnalisé ou télécharger la fiche technique complète.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="bg-white hover:bg-white/90 text-accent font-roboto font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95">
              Demander un devis
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-accent font-roboto font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95">
              Documentation
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
