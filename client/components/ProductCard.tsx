import { Download, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  category?: string;
  slug?: string;
  price?: number;
}

export function ProductCard({
  id,
  name,
  description,
  image,
  images = [],
  category,
  slug,
  price = 0,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    clientName: "",
    clientEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Use images array if available, otherwise create array from image prop
  const productImages = images.length > 0 ? images : image ? [image] : [];
  const currentImage = productImages[currentImageIndex] || image;

  const handleRequestQuote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = async () => {
    if (!quoteFormData.clientName.trim() || !quoteFormData.clientEmail.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: quoteFormData.clientName,
          clientEmail: quoteFormData.clientEmail,
          productId: id,
          productName: name,
          message: `Demande de devis pour ${name}`,
        }),
      });

      if (response.ok) {
        toast.success("Demande de devis envoyée avec succès!");
        setShowQuoteModal(false);
        setQuoteFormData({ clientName: "", clientEmail: "" });
      } else {
        toast.error("Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      console.error("Error requesting quote:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Fichier technique téléchargé!");
  };

  const handleCardClick = () => {
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 cursor-pointer animate-fade-in"
      >
        {/* Image Container - Simplified */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-64">
          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={currentImage}
              alt={name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Image Navigation Arrows - Only show on hover with multiple images */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-accent text-foreground hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                title="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-accent text-foreground hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                title="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dot Indicators - Cleaner design */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-accent w-6"
                        : "bg-white/60 hover:bg-white/80 w-2"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Container - More Compact */}
        <div className="flex flex-col flex-1 p-4 space-y-3">
          {/* Category Badge */}
          {category && (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-accent" />
              <p className="text-xs text-accent uppercase tracking-widest font-roboto font-semibold">
                {category}
              </p>
            </div>
          )}

          {/* Title */}
          {slug ? (
            <Link to={`/product/${slug}`} className="group/title">
              <h3 className="text-lg font-futura font-bold text-foreground line-clamp-2 group-hover/title:text-accent transition-colors duration-300 cursor-pointer">
                {name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-lg font-futura font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-300">
              {name}
            </h3>
          )}

          {/* Compact Description with Icon */}
          {description && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground font-roboto opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0" />
              <p className="line-clamp-1">{description.substring(0, 40)}...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-auto pt-2">
            <button
              onClick={handleRequestQuote}
              title="Demande de devis"
              className="flex-1 px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 font-futura font-semibold bg-accent hover:bg-accent/90 active:scale-95 text-white shadow-md hover:shadow-lg text-sm"
            >
              Demande devis
            </button>
            <button
              onClick={handleDownloadFile}
              title="Télécharger fichier technique"
              className="px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center bg-white hover:bg-gray-50 text-foreground hover:text-accent border border-gray-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-futura font-bold text-foreground">
                Demande de devis
              </h3>
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setQuoteFormData({ clientName: "", clientEmail: "" });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">Pour {name}</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={quoteFormData.clientName}
                    onChange={(e) =>
                      setQuoteFormData({
                        ...quoteFormData,
                        clientName: e.target.value,
                      })
                    }
                    placeholder="Votre nom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={quoteFormData.clientEmail}
                    onChange={(e) =>
                      setQuoteFormData({
                        ...quoteFormData,
                        clientEmail: e.target.value,
                      })
                    }
                    placeholder="votre@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setQuoteFormData({ clientName: "", clientEmail: "" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitQuote}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
