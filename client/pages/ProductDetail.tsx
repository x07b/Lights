import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Zap, Sun, Leaf, CheckCircle, RotateCcw, Lightbulb, Trash2 } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetailHero } from "@/components/product/ProductDetailHero";
import { BenefitsSection, type Benefit } from "@/components/product/BenefitsSection";
import { ProductDescription } from "@/components/product/ProductDescription";
import { TechnicalSpecifications } from "@/components/product/TechnicalSpecifications";
import { UseCasesSection } from "@/components/product/UseCasesSection";
import { CertificationsSection } from "@/components/product/CertificationsSection";
import { CTASection } from "@/components/product/CTASection";
import { ProductDetailsPanel, type DetailSection } from "@/components/product/ProductDetailsPanel";

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

  // Smart features for the hero section
  const smartFeatures = [
    { icon: Zap, label: "App Control" },
    { icon: Sun, label: "Tunable White" },
    { icon: Lightbulb, label: "Dimmable" },
    { icon: Leaf, label: "Écologique" },
  ];

  const features = smartFeatures.map(f => ({
    icon: <f.icon className="w-5 h-5" />,
    label: f.label,
  }));

  // Benefits with icons
  const benefits: Benefit[] = [
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

  // Certifications
  const certifications = [
    { icon: <CheckCircle className="w-12 h-12" />, label: "RoHS" },
    { icon: <RotateCcw className="w-12 h-12" />, label: "Recyclable" },
    { icon: <Lightbulb className="w-12 h-12" />, label: "CE" },
    { icon: <Trash2 className="w-12 h-12" />, label: "Ne pas jeter" },
  ];

  // Sample use cases (optional)
  const useCases = [
    {
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
      title: "Bureaux modernes",
      caption: "Illumination professionnelle et durable pour espaces de travail",
    },
    {
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      title: "Espaces résidentiels",
      caption: "Ambiance chaleureuse et flexible pour votre intérieur",
    },
    {
      image: "https://images.unsplash.com/photo-1571768910459-b1aaee40a736?w=400&h=300&fit=crop",
      title: "Environnement commercial",
      caption: "Solutions d'éclairage premium pour commerces et boutiques",
    },
  ];

  const productDescription = `Découvrez notre solution d'éclairage premium ${product.name}. Conçu avec une attention particulière aux détails, ce luminaire combine la technologie LED la plus avancée avec un design épuré et minimaliste. Parfait pour les espaces modernes qui exigent à la fois performance énergétique et esthétique raffinée.`;

  const bulletPoints = [
    "Technologie LED haute performance avec efficacité énergétique optimale",
    "Design architectural épuré et minimaliste",
    "Compatible avec systèmes de contrôle intelligents",
    "Installation facile et maintien simple",
    "Garantie de 5 ans et support technique dédié",
  ];

  // Detail sections for the sticky panel
  const detailSections: DetailSection[] = [
    {
      title: "Description du produit",
      content: product.description || "Description disponible prochainement",
    },
    {
      title: "Données techniques",
      content: product.specifications.map(s => `${s.label}: ${s.value}`),
    },
    {
      title: "Informations sur l'emballage",
      content: [
        "Dimensions du carton: Personnalisées",
        "Poids net: Selon le modèle",
        "Poids brut: Selon le modèle",
        "Quantité par carton: À confirmer",
      ],
    },
    {
      title: "Documents et certificats",
      content: product.pdfFile
        ? "Fiche technique PDF disponible au téléchargement"
        : "Documents disponibles sur demande",
    },
    {
      title: "Images et graphiques du produit",
      content: `${product.images.length} image(s) du produit disponible(s)`,
    },
    {
      title: "Cas d'application",
      content: [
        "Bureaux et espaces de travail modernes",
        "Résidences et espaces de vie",
        "Environnement commercial et retail",
        "Établissements publics et institutionnels",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-white to-gray-50 min-h-screen">
      {/* Sticky Product Details Panel - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <ProductDetailsPanel
          productName={product.name}
          productCategory={product.category}
          sections={detailSections}
        />
      </div>

      {/* Main Content with right margin for sidebar */}
      <div className="lg:mr-96">
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

        {/* Hero Section with Gallery */}
        <ProductDetailHero
          name={product.name}
          category={product.category}
          description={product.description}
          features={features}
          pdfFile={product.pdfFile}
          pdfFilename={product.pdfFilename}
        >
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </ProductDetailHero>

        {/* Benefits Section */}
        <BenefitsSection benefits={benefits} />

        {/* Product Description */}
        <ProductDescription
          content={productDescription}
          bulletPoints={bulletPoints}
        />

        {/* Technical Specifications */}
        <TechnicalSpecifications specifications={product.specifications} />

        {/* Certifications */}
        <CertificationsSection certifications={certifications} />

        {/* Use Cases Section */}
        <UseCasesSection useCases={useCases} />

        {/* Final CTA */}
        <CTASection productName={product.name} />

        {/* Mobile: Product Details Panel at bottom */}
        <div className="lg:hidden">
          <div className="bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="font-futura text-3xl font-bold text-foreground mb-8">
                Détails du produit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {detailSections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-futura font-bold text-foreground uppercase text-sm tracking-wide">
                      {section.title}
                    </h3>
                    {Array.isArray(section.content) ? (
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="font-roboto text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="text-accent">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-roboto text-sm text-muted-foreground">
                        {section.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
