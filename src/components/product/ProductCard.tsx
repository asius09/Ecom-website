interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export function ProductCard({
  name,
  description,
  price,
  imageUrl,
}: ProductCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
