import { FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Feature {
  icon: React.ReactNode;
  label: string;
}

interface ProductDetailHeroProps {
  name: string;
  category: string;
  description: string;
  features?: Feature[];
  children?: React.ReactNode; // For image gallery
}

export function ProductDetailHero({
  name,
  category,
  description,
  features = [],
  pdfFile,
  pdfFilename,
  onDownloadPDF,
  onRequestQuote,
  children,
}: ProductDetailHeroProps) {
  const handleDownloadPDF = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
      return;
    }

    if (!pdfFile) {
      toast.error("No PDF available for this product");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFilename || "technical-sheet.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRequestQuote = () => {
    if (onRequestQuote) {
      onRequestQuote();
      return;
    }

    toast.success(`Demande de devis pour ${name} envoyée!`);
  };

  return (
    <section className="py-16 px-4 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Image Gallery Slot */}
          <div className="product-gallery-container">{children}</div>

          {/* Product Info */}
          <div className="space-y-8 animate-slide-in-up">
            <div className="space-y-4">
              <p className="font-roboto text-sm uppercase tracking-widest text-accent font-semibold">
                {category}
              </p>
              <h1 className="font-futura text-5xl md:text-6xl font-bold text-foreground leading-tight">
                {name}
              </h1>
              <p className="font-roboto text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Smart Features Pills */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 text-sm font-roboto font-medium text-accent hover:bg-accent/20 transition-colors duration-300"
                  >
                    <span className="text-accent">{feature.icon}</span>
                    {feature.label}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-8 border-t border-border">
              <button
                onClick={handleRequestQuote}
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-roboto font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <Mail className="w-5 h-5" />
                Demande de devis
              </button>
              {pdfFile && (
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-roboto font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  <FileText className="w-5 h-5" />
                  Fiche technique PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
