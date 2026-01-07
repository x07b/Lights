import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductHeroPanel } from "@/components/product/ProductHeroPanel";
import { ProductDetailsPanel } from "@/components/product/ProductDetailsPanel";
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

  const detailSections = [
    {
      title: "Description du produit",
      content: product.description,
    },
    {
      title: "Données techniques",
      content: [
        "Puissance : 10W à 50W selon modèle",
        "Tension d'alimentation : 220V-240V AC",
        "Fréquence : 50-60 Hz",
        "Indice de protection : IP54",
        "Température de couleur : 3000K - 6500K",
        "Efficacité lumineuse : 130-150 lm/W",
        "Durée de vie : 50 000 heures",
        "Angle de diffusion : 120°",
      ],
    },
    {
      title: "Informations sur l'emballage",
      content: [
        "Dimensions de l'emballage : 25 x 25 x 10 cm",
        "Poids brut : 500g",
        "Matériel d'emballage : Carton recyclé avec mousse de protection",
        "Contenu : Luminaire, câbles de connexion, matériel de montage, manuel d'installation",
        "Emballage écologique et 100% recyclable",
      ],
    },
    {
      title: "Documents et certificats",
      content: [
        "Certification CE - Directive 2014/30/UE",
        "Certification RoHS - Conformité toxicité",
        "Certification FCC pour les modèles compatibles WiFi",
        "Marquage énergétique UE",
        "Déclaration de conformité disponible",
        "Manuel d'installation multilingue",
        "Schéma de connexion électrique",
      ],
    },
    {
      title: "Images et graphiques du produit",
      content: [
        "Vue de face du luminaire",
        "Vue de profil avec dimensions",
        "Vue démontée des composants",
        "Diagramme de montage étape par étape",
        "Interface de contrôle (si applicable)",
        "Options de finition disponibles",
        "Comparaison de luminosité avec autres modèles",
      ],
    },
    {
      title: "Images d'application",
      content: [
        "Installation en environnement professionnel (bureaux)",
        "Utilisation en espaces résidentiels (salon, cuisine)",
        "Installations commerciales (boutiques, galeries)",
        "Ambiance lumineuse en conditions de faible éclairage",
        "Montage mural et au plafond",
        "Configurations multi-luminaires",
        "Différents rendus de couleur et température",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Two-Column Section: Gallery + Details Left, Sticky Panel Right */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Left: Product Gallery + Details Accordion */}
          <div className="space-y-8">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
            <ProductDetailsPanel
              sections={detailSections}
              sectionTitle="Détails du produit"
              sectionSubtitle="Informations complètes"
            />
          </div>

          {/* Right: Sticky Product Info Panel */}
          <div>
            <ProductHeroPanel
              category={product.category}
              name={product.name}
              description={product.description}
              pdfFile={product.pdfFile}
              pdfFilename={product.pdfFilename}
            />
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
                  Nous garantissons la performance constante de ce luminaire
                  avec une couverture complète et un support technique réactif.
                  Votre investissement est protégé.
                </p>
              </div>
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Solution économique
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Réduisez vos coûts énergétiques tout en profitant d'une
                  qualité d'éclairage supérieure. Amortissement rapide et
                  rentabilité garantie.
                </p>
              </div>
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Respect de l'environnement
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Solution écologique et durable, recyclable et certifiée.
                  Contribuez à la préservation de l'environnement sans
                  compromis.
                </p>
              </div>
              <div>
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Support expert
                </h3>
                <p className="font-roboto text-muted-foreground leading-relaxed">
                  Équipe d'experts disponible pour assistance, conseil et
                  maintenance. Satisfaction client garantie à 100%.
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
                  Bureau, open space, salles de réunion. Créez un environnement
                  productif et confortable pour vos équipes.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Espaces résidentiels
                </h3>
                <p className="font-roboto text-muted-foreground">
                  Salon, cuisine, chambre. Transformez votre habitat avec un
                  éclairage adapté à votre style de vie.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300">
                <h3 className="font-futura text-xl font-bold text-foreground mb-3">
                  Environnements commerciaux
                </h3>
                <p className="font-roboto text-muted-foreground">
                  Boutique, galerie, showroom. Mettez en valeur vos produits
                  avec un éclairage professionnel et élégant.
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
            Contactez-nous dès maintenant pour obtenir un devis personnalisé ou
            télécharger la fiche technique complète.
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
