interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
}: ProductCardProps) {
  return (
    <div className="group cursor-pointer h-full">
      <div className="relative overflow-hidden rounded-lg bg-secondary mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div>
        {category && (
          <p className="text-xs text-accent uppercase tracking-widest font-roboto mb-2">
            {category}
          </p>
        )}
        <h3 className="text-lg font-futura font-bold text-primary mb-2 group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground font-roboto mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-futura font-bold text-primary">
            {price.toFixed(2)} TND
          </span>
        </div>
      </div>
    </div>
  );
}
