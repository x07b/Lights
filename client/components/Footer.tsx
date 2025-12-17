import { Link } from "react-router-dom";
import { Facebook, Instagram, Share2, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-primary/95 text-primary-foreground border-t border-primary-foreground/10">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20 md:py-28">
          {/* Brand */}
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-3xl font-bold font-futura">Luxence</h3>
            <p className="text-sm text-primary-foreground/80 font-roboto leading-relaxed">
              Des luminaires élégants et artistiques conçus pour sublimer les intérieurs sophistiqués avec performance et style.
            </p>
            <div className="flex gap-2 pt-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group hover:bg-accent hover:scale-110 transition-all duration-300 cursor-pointer">
                <span className="text-accent group-hover:text-white transition-colors duration-300">✦</span>
              </div>
            </div>
          </div>

          {/* À propos */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h4 className="font-futura font-bold text-lg">À propos</h4>
            <ul className="space-y-3 font-roboto text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Notre histoire
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Nos valeurs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Design éthique
                </a>
              </li>
            </ul>
          </div>

          {/* Support Client */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h4 className="font-futura font-bold text-lg">Support client</h4>
            <ul className="space-y-3 font-roboto text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Nous contacter
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Retours & échanges
                </a>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h4 className="font-futura font-bold text-lg">Catégories</h4>
            <ul className="space-y-3 font-roboto text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Suspensions
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Lampadaires
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-accent transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-accent group-hover:w-4 transition-all duration-300" />
                  Lampes de table
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/10 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Copyright */}
            <p className="text-sm text-primary-foreground/70 font-roboto">
              © 2024 Luxence. Tous droits réservés.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:animate-pulse" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:animate-pulse" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 group-hover:animate-pulse" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-white rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 group-hover:animate-pulse" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
