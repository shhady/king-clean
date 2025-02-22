'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import ProductImageGallery from '@/app/components/ProductImageGallery';
import RelatedProducts from '@/app/components/RelatedProducts';
import ProductReviews from '@/app/components/ProductReviews';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { FaHeart } from 'react-icons/fa';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const [isClient, setIsClient] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (!id) return; 
    setIsClient(true);
    fetchProduct();
  }, [id]);

  const fetchProduct = async (retryCount = 3) => {
    try {
      const response = await fetch(`/api/products/${id}`, { cache: 'no-store' });
  
      if (!response.ok) {
        if (retryCount > 0) {
          console.warn(`⚠️ Fetch failed, retrying... (${3 - retryCount + 1}/3)`);
          return fetchProduct(retryCount - 1);
        }
        throw new Error('Failed to fetch product');
      }
  
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError('טעינת המוצר נכשלה');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        טוען...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-gray-300 rounded-lg mx-auto" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error || 'המוצר לא נמצא'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="flex flex-col md:flex-row gap-4 md:justify-between">
          {/* Main Image */}
          <div className="relative w-full md:flex-1 h-[400px] md:order-2">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain rounded-lg border-2 border-gray-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          </div>

          {/* Thumbnails */}
          <div className={`
            flex md:flex-col gap-4 
            md:h-[400px] md:overflow-y-auto
            overflow-x-auto pb-2 md:pb-0
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
            md:w-20 w-full
            md:order-1
            md:flex-shrink-0
          `}>
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`
                  relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors
                  ${selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='flex flex-col justify-between items-start'>
          <div className='flex justify-between items-start pl-4 py-2 w-full'>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              {/* Category */}
              {product.category && (
                <div>
                  <p className="text-sm text-gray-600">
                    {product.category.name}
                  </p>
                </div>
              )}
              <div className="prose max-w-none my-8">
                <h3 className="text-lg font-semibold mb-2">תיאור</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
            <p className="text-2xl font-bold mb-6">
              ₪{product.price}
            </p>
          </div>

          {/* Stock Status */}
          {user?.user?.publicMetadata?.role === 'admin' && (
            <div className="mb-6">
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `מלאי: ${product.stock} יחידות` : 'אזל מהמלאי'}
              </p>
            </div>
          )}

          <div className="flex items-center w-full gap-4">
            <button
              onClick={() => {
                addToCart(product);
                toast.success('המוצר נוסף לסל');
              }}
              disabled={product.stock <= 0}
              className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                product.stock > 0 
                  ? 'bg-blue-500 text-white hover:bg-primary-dark' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart />
              {product.stock > 0 ? 'הוסף לסל' : 'אזל מהמלאי'}
            </button>

            {isInWishlist(product._id) ? (
              <FaHeart 
                className="w-5 h-5 text-red-500 cursor-pointer" 
                onClick={() => {
                  removeFromWishlist(product._id);
                  toast.success('הוסר מהמועדפים');
                }}
              />
            ) : (
              <FiHeart 
                className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" 
                onClick={() => {
                  addToWishlist(product);
                  toast.success('נוסף למועדפים');
                }}
              />
            )}
          </div>

          {/* Sales Statistics (Admin Only) */}
          {user?.user?.publicMetadata?.role === 'admin' && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">נתוני מכירות</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">סה"כ מכירות</p>
                  <p className="text-2xl font-bold">{product.sales}</p>
                </div>
              </div>

              {/* Sales History */}
              {product.salesHistory?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">היסטוריית מכירות</h4>
                  <div className="space-y-2">
                    {product.salesHistory.map((sale, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{new Date(sale.date).toLocaleDateString('he-IL')}</span>
                        <span>{sale.quantity} יחידות</span>
                        <Link href={`/orders/${sale.orderId}`} className="text-blue-500 hover:underline">
                          פרטי הזמנה
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <RelatedProducts 
        categoryId={product.category?._id?.toString()}
        currentProductId={product._id} 
      />
    </div>
  );
} 