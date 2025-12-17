import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: "https://cdn.builder.io/api/v1/image/assets%2F11b105e941ff40af8cd2ef0003fa406d%2F80f49dcbcff144e48bb99a3e868cbfec?format=webp&width=800",
      alt: "Luxence Brand Banner 1"
    },
    {
      id: 2,
      image: "https://cdn.builder.io/api/v1/image/assets%2F11b105e941ff40af8cd2ef0003fa406d%2F46093dda2072493bb83a5549bcecfaf9?format=webp&width=800",
      alt: "Luxence Brand Banner 2"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary/95 text-primary-foreground py-24 md:py-40 overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-2xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="animate-fade-in space-y-8">
            <div className="space-y-6">
              <p className="text-accent font-roboto text-sm font-semibold uppercase tracking-widest animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.2s forwards' }}>
                Collection Luxury Lighting
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-futura font-bold mb-4 leading-tight animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.3s forwards' }}>
                Illuminez vos espaces avec l'essence du luxe
              </h1>
            </div>

            <p className="text-lg md:text-xl text-primary-foreground/85 font-roboto max-w-lg leading-relaxed animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.4s forwards' }}>
              Des luminaires élégants et artistiques conçus pour sublimer les intérieurs sophistiqués. Chaque pièce représente l'excellence en matière de design et de performance lumineuse.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.5s forwards' }}>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 hover:shadow-lg hover:gap-4 group active:scale-95"
              >
                Découvrir la collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 rounded-lg font-futura font-bold transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative animate-slide-up group">
            {/* Carousel Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              {/* Slides */}
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                </div>
              ))}

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-accent w-8'
                        : 'bg-white/50 hover:bg-white/75 w-2'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-accent/15 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Premium border accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-accent/10 rounded-2xl -z-20 blur-xl" />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0" />
    </section>
  );
}
