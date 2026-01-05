import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { CollectionsDropdown } from "./CollectionsDropdown";
import { ProductSearchOverlay } from "./ProductSearchOverlay";

interface Product {
  id: string;
  name: string;
  slug: string;
  category?: string;
  price: number;
  image: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    // Fetch products from localStorage (from admin added products)
    const storedProducts = localStorage.getItem("admin-products");
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center h-12 hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4bd5a48984ac41abb50f4c9c327d1d89%2F8809a042284e4ef7a6e668ae9ec8758f?format=webp&width=800"
              alt="Luxence Logo"
              className="h-full object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-accent relative font-roboto text-sm font-medium transition-colors duration-300 group"
            >
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/products"
              className="text-foreground hover:text-accent relative font-roboto text-sm font-medium transition-colors duration-300 group"
            >
              Produits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <CollectionsDropdown />
            <Link
              to="/about"
              className="text-foreground hover:text-accent relative font-roboto text-sm font-medium transition-colors duration-300 group"
            >
              À propos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-accent relative font-roboto text-sm font-medium transition-colors duration-300 group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:shadow-md">
              <Search className="w-5 h-5 text-foreground hover:text-accent transition-colors duration-300" />
            </button>
            <Link
              to="/checkout"
              className="p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:shadow-md relative group"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-primary-foreground text-xs font-futura font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-all duration-300 hover:shadow-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border animate-slide-up">
            <Link
              to="/"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            <Link
              to="/collections"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              to="/about"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block py-3 px-2 text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-all duration-300 font-roboto text-sm font-medium"
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
