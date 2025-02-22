'use client';
import { useState, useEffect, useRef, useCallback, Suspense, forwardRef } from 'react';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import ProductSkeleton from '@/app/components/ProductSkeleton';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import { FiLoader, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { useSearchParams, useRouter } from 'next/navigation';

const PRICE_RANGES = [
  { label: 'הכל', value: 'all', min: null, max: null },
  { label: '₪1 - ₪200', value: 'range1', min: 1, max: 200 },
  { label: '₪200 - ₪500', value: 'range2', min: 200, max: 500 },
  { label: '₪500 - ₪800', value: 'range3', min: 500, max: 800 },
  { label: 'מעל ₪800', value: 'range4', min: 800, max: null },
];

// Loading component for the product grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => {
    const categoryId = searchParams.get('category');
    return {
      category: categoryId || '',
      priceRange: '',
      inStock: false
    };
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Reference to track if we're currently fetching
  const isFetching = useRef(false);
  // Reference to the observer
  const observer = useRef();
  // Reference to the last product element
  const lastProductRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetching.current) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const filtersRef = useRef();

  useEffect(() => {
    fetchCategories();
    // Update filters when URL category parameter changes
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setFilters(prev => ({
        ...prev,
        category: categoryId
      }));
    }
  }, [searchParams]);

  // Single useEffect for all filter changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [filters, sortBy, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('שגיאה בטעינת קטגוריות');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('שגיאה בטעינת קטגוריות:', error);
    }
  };

  const fetchProducts = async (pageNum, isNewSearch = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);
    setError(null);
  
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        sortBy,
      });
      
      // Add search query if provided
      if (searchQuery?.trim()) {
        queryParams.append('search', searchQuery.trim());
      }
      
      // Add category filter if provided
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      
      // **Add subcategory filter if provided**
      if (filters.subcategory) {
        queryParams.append('subcategory', filters.subcategory);
      }
  
      // Add price range filter if provided
      if (filters.priceRange && filters.priceRange !== 'all') {
        const selectedRange = PRICE_RANGES.find(range => range.value === filters.priceRange);
        if (selectedRange) {
          if (selectedRange.min) queryParams.append('minPrice', selectedRange.min.toString());
          if (selectedRange.max) queryParams.append('maxPrice', selectedRange.max.toString());
        }
      }
  
      // Add inStock filter if enabled
      if (filters.inStock) {
        queryParams.append('inStock', 'true');
      }
  
      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) throw new Error('שגיאה בטעינת מוצרים');
      const data = await response.json();
      
      if (isNewSearch) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }
      setHasMore(data.products.length === 10);
    } catch (error) {
      setError(error.message);
      console.error('שגיאה בטעינת מוצרים:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // If filters are cleared and we're on a category page, update the URL
    if (!newFilters.category && searchParams.get('category')) {
      router.push('/shop', { scroll: false });
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href={`/shop?category=${searchParams.get('category')}`}
            className="text-primary hover:text-primary-dark"
          >
            הצג את כל המוצרים
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">מוצרים</h1>
      
      <ErrorBoundary>
        <ProductFilters
          ref={filtersRef}
          categories={categories}
          initialCategory={searchParams.get('category')}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
        />

        <Suspense fallback={<ProductGridSkeleton />}>
          {products.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>לא נמצאו מוצרים התואמים את החיפוש</p>
              <button
                onClick={() => {
                  filtersRef.current?.clearFilters();
                }}
                className="mt-4 text-primary hover:text-primary-dark"
              >
                הצג את כל המוצרים
              </button>
            </div>
          ) : (
            <div>
              <ProductGrid 
                products={products} 
                lastProductRef={lastProductRef}
              />
              
              {isLoading && (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
} 