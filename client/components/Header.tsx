import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold font-futura text-primary">
              Luxence
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-accent transition-colors font-roboto text-sm"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="text-foreground hover:text-accent transition-colors font-roboto text-sm"
            >
              Produits
            </Link>
            <Link
              to="/collections"
              className="text-foreground hover:text-accent transition-colors font-roboto text-sm"
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-accent transition-colors font-roboto text-sm"
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-accent transition-colors font-roboto text-sm"
            >
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Search className="w-5 h-5 text-primary" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-accent transition-colors font-roboto text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="block py-2 text-foreground hover:text-accent transition-colors font-roboto text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              to="/collections"
              className="block py-2 text-foreground hover:text-accent transition-colors font-roboto text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground hover:text-accent transition-colors font-roboto text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-foreground hover:text-accent transition-colors font-roboto text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
