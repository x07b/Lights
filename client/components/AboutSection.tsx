import { CheckCircle } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F912ded31f1c040bbb8e059f551179c76?format=webp&width=800"
                alt="Luxence brand banner"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 space-y-8">
            <div className="space-y-3 animate-fade-in">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-futura font-bold text-primary leading-tight">
                Rejoignez l'univers <span className="text-accent">Luxence</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </div>

            <p className="text-base md:text-lg text-muted-foreground font-roboto leading-relaxed animate-fade-in" style={{ animationDelay: "100ms" }}>
              Depuis vingt ans, Luxence crée des luminaires qui transcendent l'ordinaire. Nous fusionnons design artistique et excellence fonctionnelle pour transformer vos espaces.
            </p>

            <div className="space-y-3 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-futura font-bold text-primary">Design artistique</h3>
                  <p className="text-sm text-muted-foreground font-roboto">Œuvres d'art conçues par des designers de renom</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-futura font-bold text-primary">Matériaux premium</h3>
                  <p className="text-sm text-muted-foreground font-roboto">Sélection rigoureuse de matériaux nobles</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-accent group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-futura font-bold text-primary">Excellence fonctionnelle</h3>
                  <p className="text-sm text-muted-foreground font-roboto">Esthétique et performance en harmonie</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground font-roboto text-sm pt-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              L'expérience Luxence est un voyage dans l'univers du design lumière, où chaque détail crée l'ambiance parfaite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
