import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-futura font-bold mb-6 leading-tight">
              Illuminez vos espaces avec l'essence du luxe
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 font-roboto mb-8 max-w-lg">
              Des luminaires élégants et artistiques conçus pour sublimer les
              intérieurs sophistiqués.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 hover:gap-4 group"
            >
              Découvrir la collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1565636192335-14e9b763bd21?w=800&q=80"
                alt="Premium lighting fixture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -right-4 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
