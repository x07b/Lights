import { ProductCard } from "./ProductCard";

const products = [
  {
    id: "1",
    name: "Suspension Minimaliste",
    description: "Design épuré en métal brossé et verre",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1565636192335-14e9b763bd21?w=400&q=80",
    category: "Suspensions",
  },
  {
    id: "2",
    name: "Lampadaire Signature",
    description: "Pied en marbre blanc, abat-jour en lin",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1584622614875-2f38dd7aaf60?w=400&q=80",
    category: "Lampadaires",
  },
  {
    id: "3",
    name: "Lampe de Table Élégante",
    description: "Base en laiton doré, diffuseur en soie",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
    category: "Lampes de table",
  },
  {
    id: "4",
    name: "Applique Murale Moderne",
    description: "Géométrique en acier noir mat",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d782f?w=400&q=80",
    category: "Appliques",
  },
  {
    id: "5",
    name: "Lustre Artistique",
    description: "Cristal taillé, armature en laiton",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1565636192335-14e9b763bd21?w=400&q=80",
    category: "Suspensions",
  },
  {
    id: "6",
    name: "Lampe Architecte",
    description: "Articulée, variateur intégré",
    price: 219.99,
    image: "https://images.unsplash.com/photo-1584622614875-2f38dd7aaf60?w=400&q=80",
    category: "Lampes de table",
  },
];

export function FeaturedProductsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-futura font-bold text-primary mb-4">
            Nos luminaires emblématiques
          </h2>
          <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">
            Découvrez notre sélection des luminaires les plus prisés
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in" style={{
              animationDelay: `${index * 100}ms`,
            }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
