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
    <aside className="product-details-panel fixed right-0 top-0 h-screen w-96 bg-white border-l border-border overflow-y-auto shadow-xl z-40">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-border z-50 px-6 py-8 shadow-sm">
        <p className="text-accent font-roboto text-xs uppercase tracking-widest font-bold mb-1">
          {productCategory || "Produit"}
        </p>
        <h2 className="font-futura text-2xl font-bold text-foreground leading-tight">
          {productName}
        </h2>
      </div>

      {/* Accordion Sections */}
      <div className="px-6 py-8 space-y-2">
        <div className="mb-4 pb-4 border-b border-border">
          <p className="text-accent font-roboto text-xs uppercase tracking-widest font-bold">
            Détails du produit
          </p>
        </div>

        <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full space-y-2">
          {sections.map((section, index) => (
            <AccordionItem
              key={`section-${index}`}
              value={`section-${index}`}
              className="border border-border rounded-lg px-4 py-0 hover:bg-gray-50/50 transition-colors duration-300"
            >
              <AccordionTrigger className="text-lg font-bold text-foreground py-4 hover:no-underline hover:text-accent transition-colors duration-300 group">
                <span className="font-futura font-bold uppercase tracking-wide text-sm">
                  {section.title}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </AccordionTrigger>

              <AccordionContent className="pb-4 pt-0">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex gap-3 items-start font-roboto text-sm text-muted-foreground"
                      >
                        <span className="text-accent font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-roboto text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Bottom Spacing */}
      <div className="h-24" />
    </aside>
  );
}
