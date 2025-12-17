import { CheckCircle } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F912ded31f1c040bbb8e059f551179c76?format=webp&width=800"
                alt="Luxence brand banner"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-5xl font-futura font-bold text-primary mb-6">
              Rejoignez l'univers Luxence
            </h2>

            <p className="text-lg text-muted-foreground font-roboto mb-6 leading-relaxed">
              Depuis plus de deux décennies, Luxence se distingue par son
              approche unique de l'éclairage haut de gamme. Nous combinons le
              design artistique avec la fonctionnalité pour créer des luminaires
              qui transcendent le simple éclairage.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-futura font-bold text-primary mb-1">
                    Design artistique
                  </h3>
                  <p className="text-muted-foreground font-roboto text-sm">
                    Chaque luminaire est une œuvre d'art conçue par des
                    designers renommés
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-futura font-bold text-primary mb-1">
                    Matériaux premium
                  </h3>
                  <p className="text-muted-foreground font-roboto text-sm">
                    Sélection rigoureuse des matériaux nobles et durables
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-futura font-bold text-primary mb-1">
                    Équilibre fonctionnel
                  </h3>
                  <p className="text-muted-foreground font-roboto text-sm">
                    Esthétique et performance lumineuse en parfaite harmonie
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground font-roboto">
              L'expérience Luxence est bien plus qu'un achat: c'est un voyage
              dans l'univers du design lumière, où chaque détail compte pour
              créer l'ambiance parfaite de votre intérieur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
