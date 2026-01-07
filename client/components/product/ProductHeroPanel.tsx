import { FileText, Mail } from "lucide-react";
import { toast } from "sonner";

interface ProductHeroPanelProps {
  category: string;
  name: string;
  description: string;
  pdfFile?: string;
  pdfFilename?: string;
}

export function ProductHeroPanel({
  category,
  name,
  description,
  pdfFile,
  pdfFilename,
}: ProductHeroPanelProps) {
  const handleRequestQuote = () => {
    toast.success(`Demande de devis pour ${name} envoyée!`);
  };

  const handleDownloadPDF = () => {
    if (!pdfFile) {
      toast.error("Fiche technique non disponible");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFilename || "fiche-technique.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sticky top-24 h-fit space-y-6">
      {/* Category Tag */}
      <p className="font-roboto text-sm uppercase tracking-widest text-accent font-bold">
        {category}
      </p>

      {/* Title */}
      <h1 className="font-futura text-3xl lg:text-4xl font-bold text-foreground leading-tight">
        {name}
      </h1>

      {/* Description */}
      <p className="font-roboto text-base text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-accent to-transparent" />

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Request Quote Button - Primary */}
        <button
          onClick={handleRequestQuote}
          className="w-full bg-accent hover:bg-accent/90 text-white font-roboto font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          <Mail className="w-5 h-5" />
          Demande de devis
        </button>

        {/* Download PDF - Secondary */}
        {pdfFile && (
          <button
            onClick={handleDownloadPDF}
            className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white font-roboto font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <FileText className="w-5 h-5" />
            Fiche technique
          </button>
        )}
      </div>

      {/* Info Text */}
      <p className="text-xs text-muted-foreground text-center">
        Demandez un devis gratuit et sans engagement
      </p>
    </div>
  );
}
