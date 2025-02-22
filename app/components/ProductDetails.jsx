'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductRecommendations from './ProductRecommendations';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function ProductDetails({ id }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // This would normally come from an API or database
  const product = {
    id,
    name: "طقم كريستال فاخر",
    price: "1,200",
    description: "طقم كريستال تشيكي فاخر مكون من 6 قطع، مصنوع يدوياً بتصميم كلاسيكي أنيق",
    images: [
      "/images/product1.jpg",
      "/images/product1-2.jpg",
      "/images/product1-3.jpg",
      "/images/product1-4.jpg"
    ],
    features: [
      "صناعة يدوية",
      "كريستال تشيكي أصلي",
      "تصميم كلاسيكي",
      "6 قطع"
    ]
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace(',', '')),
      image: product.images[0],
      quantity
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <Zoom>
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </Zoom>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
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
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl text-primary font-bold">{product.price} شيكل</p>
          <p className="text-gray-600">{product.description}</p>

          <div>
            <h3 className="font-bold mb-2">المميزات:</h3>
            <ul className="list-disc list-inside space-y-2">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <label htmlFor="quantity" className="font-bold">الكمية:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingCart />
                أضف للسلة
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className={`p-3 rounded-lg border ${
                  isInWishlist(product.id)
                    ? 'text-red-500 border-red-500'
                    : 'text-gray-400 border-gray-300'
                } hover:text-red-500 hover:border-red-500 transition-colors`}
              >
                <FiHeart className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Recommendations */}
      <ProductRecommendations currentProductId={id} />
    </div>
  );
} 