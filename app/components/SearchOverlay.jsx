'use client';
import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchOverlay({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when overlay closes
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search results');
      }

      setSearchResults(data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="container mx-auto px-4 py-16">
        <div 
          className="bg-white rounded-lg p-6 max-w-2xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              className="w-full p-4 pr-12 border rounded-lg"
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <FiSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Search results */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">
                <FiLoader className="w-6 h-6 animate-spin mx-auto" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product._id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={product.images[0]}
                        alt={product.nameAr || product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.nameAr || product.name}</h3>
                      <p className="text-primary font-bold">{product.price} ₪</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">ابدأ البحث...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 