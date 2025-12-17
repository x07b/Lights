import {
  Download,
  Zap,
  Sun,
  Lightbulb,
  RotateCcw,
  Trash2,
  Leaf,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const productsDatabase = [
  {
    id: "led-panel-light",
    slug: "led-frameless-panel",
    name: "LED Frameless Panel Light",
    category: "Panneaux LED",
    description: "Panneau LED encastrable, design discret et performance lumineuse optimale.",
    image: "https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2Fff2a6753fb754ad38342a3f05b4cd636?format=webp&width=800",
    price: 49.0,
    specifications: [
      { label: "Puissance", value: "10W" },
      { label: "Forme", value: "Ronde" },
      { label: "Type", value: "Encastré" },
      { label: "Couleur", value: "Blanc" },
      { label: "Température de couleur", value: "6500K" },
      { label: "Flux lumineux", value: "1200 lm" },
      { label: "Durée de vie", value: "3000 heures" },
      { label: "Certification", value: "CE" },
      { label: "Indice de protection", value: "IP20" },
      { label: "Pays d'origine", value: "Fabriqué en Chine" },
    ],
    pdfFile: "/fiche-technique-led-panel.pdf",
    pdfFilename: "Luxence-LED-Panel-Light-Fiche-Technique.pdf",
  },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = productsDatabase.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="bg-[#FFF8F9] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-futura text-4xl font-bold text-[#15203C]">
            Produit non trouvé
          </h1>
          <p className="font-roboto text-gray-600">
            Le produit que vous recherchez n'existe pas.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#F97338] hover:bg-[#e66428] text-white font-roboto font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = product.pdfFile;
    link.download = product.pdfFilename;
    link.click();
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
    <div className="bg-[#FFF8F9] min-h-screen">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-white rounded-2xl p-8 sm:p-12 shadow-lg">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2Fff2a6753fb754ad38342a3f05b4cd636?format=webp&width=800"
                alt="LED Frameless Panel Light"
                className="w-full h-auto max-w-md object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="font-roboto text-sm uppercase tracking-widest text-[#F97338] mb-2">
                  Panneaux LED
                </p>
                <h1 className="font-futura text-4xl sm:text-5xl font-bold text-[#15203C] mb-4">
                  LED Frameless Panel Light
                </h1>
                <p className="font-roboto text-lg text-gray-700 leading-relaxed">
                  Panneau LED encastrable, design discret et performance
                  lumineuse optimale.
                </p>
              </div>

              <div className="border-t border-b border-[#F97338] py-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-roboto text-gray-600">Puissance</span>
                  <span className="font-roboto font-semibold text-[#15203C]">
                    10W
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-roboto text-gray-600">Type</span>
                  <span className="font-roboto font-semibold text-[#15203C]">
                    Encastré
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-roboto text-gray-600">
                    Flux lumineux
                  </span>
                  <span className="font-roboto font-semibold text-[#15203C]">
                    1200 lm
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-roboto font-bold text-[#15203C]">
                    Prix
                  </span>
                  <span className="font-futura font-bold text-[#F97338] text-2xl">
                    49,00 TND
                  </span>
                </div>
              </div>

              <Button
                onClick={handleDownloadPDF}
                className="w-full bg-[#F97338] hover:bg-[#e66428] text-white font-roboto font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger la fiche technique
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-futura text-3xl sm:text-4xl font-bold text-[#15203C] mb-12 text-center">
            Avantages clés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-[#FFF8F9] rounded-full flex items-center justify-center text-[#F97338]">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="font-futura text-xl font-bold text-[#15203C]">
                  {advantage.title}
                </h3>
                <p className="font-roboto text-gray-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-12 md:py-16 px-4 bg-[#FFF8F9]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-futura text-3xl sm:text-4xl font-bold text-[#15203C] mb-8 text-center">
            Caractéristiques techniques
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {specifications.map((spec, index) => (
                <div key={index} className="p-6 flex items-center">
                  <div className="w-1/2">
                    <p className="font-roboto text-gray-600">{spec.label}</p>
                  </div>
                  <div className="w-1/2 text-right">
                    <p className="font-roboto font-semibold text-[#15203C] text-lg">
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
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-futura text-3xl sm:text-4xl font-bold text-[#15203C] mb-12 text-center">
            Certifications et conformité
          </h2>
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
              <div key={index} className="flex flex-col items-center gap-3 p-6">
                <div className="text-[#F97338]">{cert.icon}</div>
                <p className="font-roboto text-sm font-semibold text-[#15203C] text-center">
                  {cert.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-[#15203C] to-[#1a2848]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-futura text-3xl sm:text-4xl font-bold text-white">
            Prêt à améliorer votre éclairage ?
          </h2>
          <p className="font-roboto text-lg text-gray-100">
            Découvrez la performance et l'élégance du panneau LED Luxence
            Frameless
          </p>
          <Button className="bg-[#F97338] hover:bg-[#e66428] text-white font-roboto font-semibold py-3 px-8 rounded-lg inline-flex items-center gap-2">
            Nous contacter
          </Button>
        </div>
      </section>
    </div>
  );
}
