import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Collection } from "@shared/api";

export function CollectionsDropdown() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/collections");
      const data = await response.json();

      if (data.success) {
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <button className="text-foreground hover:text-accent relative font-roboto text-sm font-medium transition-colors duration-300 flex items-center gap-1 group/btn">
        Collections
        <ChevronDown className="w-4 h-4 group-hover/btn:text-accent transition-transform duration-300 group-hover/btn:rotate-180" />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute left-0 mt-0 w-48 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
        {isLoading ? (
          <div className="px-4 py-3 text-sm text-muted-foreground font-roboto text-center">
            Chargement...
          </div>
        ) : collections.length > 0 ? (
          <nav className="py-2">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-secondary hover:text-accent font-roboto text-sm transition-colors duration-200"
              >
                {collection.name}
              </Link>
            ))}
          </nav>
        ) : (
          <div className="px-4 py-3 text-sm text-muted-foreground font-roboto text-center">
            Aucune collection
          </div>
        )}
      </div>
    </div>
  );
}
