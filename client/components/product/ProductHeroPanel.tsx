import { Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

interface ProductHeroPanelProps {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  slug: string;
}

export function ProductHeroPanel({
  id,
  category,
  name,
  description,
  price,
  slug,
}: ProductHeroPanelProps) {
  const { addItem } = useCart();

  const handleRequestQuote = () => {
    addItem({
      id,
      name,
      price,
      quantity: 1,
      slug,
    });
    toast.success(`${name} ajouté à la demande de devis!`);
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
      </div>

      {/* Info Text */}
      <p className="text-xs text-muted-foreground text-center">
        Demandez un devis gratuit et sans engagement
      </p>
    </div>
  );
}
