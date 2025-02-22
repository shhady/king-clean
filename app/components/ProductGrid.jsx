import ProductCard from "./ProductCard";
import Link from "next/link";

export default function ProductGrid({ products, lastProductRef }) {
  const getShade = (index) => {
    // Calculate position in row (0, 1, 2, 3)
    const position = index % 5;
    switch(position) {
      case 0: return 'light';
      case 1: return 'medium-light';
      case 2: return 'medium';
      case 3: return 'medium-dark';
      case 4: return 'dark';
      default: return 'light';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-2">
      {products.map((product, index) => (
        <div
          key={product._id}
          ref={index === products.length - 1 ? lastProductRef : null}
        >
          <Link 
            href={`/shop/${product._id}`}
            className="block cursor-pointer h-full"
          >
            <ProductCard 
              product={product} 
              shade={'light'}
            />
          </Link>
        </div>
      ))}
    </div>
  );
} 