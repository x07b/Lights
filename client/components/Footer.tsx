import { Link } from "react-router-dom";
import { Facebook, Instagram, Share2, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-futura mb-4">Luxence</h3>
            <p className="text-sm text-primary-foreground/80 font-roboto">
              Des luminaires élégants et artistiques conçus pour sublimer les
              intérieurs sophistiqués.
            </p>
          </div>

          {/* À propos */}
          <div>
            <h4 className="font-futura font-bold mb-4">À propos</h4>
            <ul className="space-y-2 font-roboto text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Notre histoire
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Nos valeurs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Design éthique
                </a>
              </li>
            </ul>
          </div>

          {/* Support Client */}
          <div>
            <h4 className="font-futura font-bold mb-4">Support client</h4>
            <ul className="space-y-2 font-roboto text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Retours & échanges
                </a>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="font-futura font-bold mb-4">Catégories</h4>
            <ul className="space-y-2 font-roboto text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Suspensions
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Lampadaires
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Lampes de table
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-primary-foreground/70 font-roboto">
              © 2024 Luxence. Tous droits réservés.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
