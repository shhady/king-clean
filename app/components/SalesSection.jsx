'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';

export default function SalesSection({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2); // Start from page 2 since we have initial data
  const observer = useRef();
  const ITEMS_PER_PAGE = 12;

  const lastProductElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchMoreProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/sales?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = await response.json();
      
      setProducts(prevProducts => {
        const newProducts = [...prevProducts, ...data.products];
        // Remove duplicates based on _id
        return Array.from(new Map(newProducts.map(item => [item._id, item])).values());
      });
      setHasMore(data.products.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching sale products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page > 2) { // Only fetch more if we're past the initial page
      fetchMoreProducts();
    }
  }, [page]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">מבצעים מיוחדים</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => {
            const isLastElement = products.length === index + 1;
            
            return (
              <div
                key={product._id}
                ref={isLastElement ? lastProductElementRef : null}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <Link href={`/shop/${product._id}`}>
                  <div className="relative">
                    {/* Sale Badge */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold z-10">
                      {product.salePercentage}% הנחה
                    </div>
                    
                    {/* Product Image */}
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-right">{product.name}</h3>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">
                              ₪{(product.price * (1 - product.salePercentage / 100)).toFixed(0)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₪{product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <FiShoppingCart />
                        הוסף לסל
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        
        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </section>
  );
} 