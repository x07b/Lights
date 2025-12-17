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
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary/95 text-primary-foreground py-12 md:py-20 overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-2xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in space-y-6">
            <div className="space-y-3">
              <p className="text-accent font-roboto text-xs font-semibold uppercase tracking-widest animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.2s forwards' }}>
                Luxury Lighting
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-futura font-bold leading-tight animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.3s forwards' }}>
                Illuminez vos espaces
              </h1>
            </div>

            <p className="text-sm md:text-base text-primary-foreground/85 font-roboto leading-relaxed animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.4s forwards' }}>
              Des luminaires élégants pour sublimer vos intérieurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-slide-up opacity-0" style={{ animation: 'slide-up 0.6s ease-out 0.5s forwards' }}>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-futura font-bold text-sm transition-all duration-300 hover:shadow-lg group active:scale-95"
              >
                Découvrir
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-6 py-3 rounded-lg font-futura font-bold text-sm transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative animate-slide-up group">
            {/* Carousel Container */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-accent w-6'
                        : 'bg-white/50 hover:bg-white/75 w-1.5'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating accent elements - reduced size */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10 animate-pulse" />
            <div className="absolute -top-4 -right-4 w-40 h-40 bg-accent/15 rounded-full blur-2xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Premium border accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-accent/10 rounded-xl -z-20 blur-lg" />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0" />
    </section>
  );
}
