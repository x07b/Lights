import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

export interface DetailSection {
  title: string;
  content: string | string[];
}

interface ProductDetailsPanelProps {
  productName: string;
  productCategory?: string;
  sections: DetailSection[];
}

export function ProductDetailsPanel({
  productName,
  productCategory,
  sections,
}: ProductDetailsPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  return (
    <aside className="product-details-panel fixed right-0 top-0 h-screen w-96 bg-white border-l border-border overflow-y-auto shadow-2xl z-40 animate-slide-in-right">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border z-50 px-6 py-8 shadow-sm">
        <p className="text-accent font-roboto text-xs uppercase tracking-widest font-bold mb-2">
          {productCategory || "Produit"}
        </p>
        <h2 className="font-futura text-2xl font-bold text-foreground leading-tight line-clamp-3">
          {productName}
        </h2>
      </div>

      {/* Accordion Sections */}
      <div className="px-4 py-6 space-y-1">
        <div className="mb-6 pb-4 border-b-2 border-accent/20">
          <p className="text-accent font-roboto text-xs uppercase tracking-widest font-bold">
            ✓ Détails du produit
          </p>
        </div>

        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="w-full space-y-3"
        >
          {sections.map((section, index) => (
            <AccordionItem
              key={`section-${index}`}
              value={`section-${index}`}
              className="border border-border/50 rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-md"
            >
              <AccordionTrigger className="text-base font-bold text-foreground py-4 px-4 hover:no-underline hover:text-accent hover:bg-accent/5 transition-all duration-300 group">
                <span className="font-futura font-bold uppercase tracking-wider text-xs">
                  {section.title}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 text-accent" />
              </AccordionTrigger>

              <AccordionContent className="pb-4 pt-2 px-4 bg-white border-t border-border/20">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex gap-3 items-start font-roboto text-xs text-muted-foreground leading-relaxed"
                      >
                        <span className="text-accent font-bold mt-1.5 flex-shrink-0">→</span>
                        <span className="flex-grow">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-roboto text-xs text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Bottom CTA Section */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-border px-4 py-6 space-y-3">
        <a
          href="#cta-section"
          className="block w-full bg-accent hover:bg-accent/90 text-white font-roboto font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          Demander un devis
        </a>
        <p className="font-roboto text-xs text-muted-foreground text-center">
          Sélectionnez des produits et demandez un devis personnalisé
        </p>
      </div>

      {/* Bottom Spacing */}
      <div className="h-12" />
    </aside>
  );
}
