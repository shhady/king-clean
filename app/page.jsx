'use server';

import Link from 'next/link';
import ProductCard from './components/ProductCard';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
import Product from '@/app/models/Product';

function serializeProduct(product) {
  return {
    _id: product._id.toString(),
    name: product.name,
    nameAr: product.nameAr,
    description: product.description,
    descriptionAr: product.descriptionAr,
    price: product.price,
    salePercentage: product.salePercentage,
    images: product.images,
    stock: product.stock,
    unit: product.unit,
    unitAmount: product.unitAmount,
    category: product.category ? {
      _id: product.category._id?.toString(),
      name: product.category.name,
      nameAr: product.category.nameAr
    } : null
  };
}

async function getSaleProducts() {
  await dbConnect();
  const products = await Product.find({ 
    salePercentage: { $gt: 0 },
    stock: { $gt: 0 }
  })
    .sort({ salePercentage: -1 })
    .populate('category', 'name nameAr')
    .limit(20)
    .lean();

  return products.map(serializeProduct);
}

// async function getTopProducts() {
//   await dbConnect();
//   const products = await Product.find({ 
//     isActive: true,
//     stock: { $gt: 0 }
//   })
//     .sort({ orderCount: -1 })
//     .limit(12)
//     .lean();

//   return products;
// }

// async function getCategories() {
//   await dbConnect();
//   const categories = await Category.find().lean();
//   return categories;
// }

export default async function Home() {
  const saleProducts = await getSaleProducts();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl lg:max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-right">
              מוצרי ניקיון איכותיים
              <br />
              <span className="text-blue-100">במחירים משתלמים</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 text-right">
              מגוון רחב של מוצרי ניקיון מקצועיים לבית, למשרד ולעסק
            </p>
            <div className="flex gap-4 justify-end">
              <Link
                href="/shop"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold text-lg flex items-center gap-2"
              >
                לקטלוג המוצרים
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-20">
          <div className="relative w-full h-full">
            <Image
              src="/cleaning-pattern.png"
              alt="Decorative Pattern"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </section>

 
      {/* Sales Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            
            <h2 className="text-3xl font-bold text-right">מבצעים חמים 🔥</h2>
            {/* <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
              לכל המבצעים 
            </Link> */}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <Link 
                key={product._id}
                href={`/shop/${product._id}`}
                className="block cursor-pointer h-full"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {saleProducts.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              אין מבצעים זמינים כרגע
            </div>
          )}
        </div>
      </section>

     
      {/* Call to Action */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">צריכים עזרה בבחירת מוצרים?</h2>
          <p className="text-xl text-gray-600 mb-8">הצוות המקצועי שלנו ישמח לעזור לכם לבחור את המוצרים המתאימים ביותר</p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold text-lg"
          >
            דברו איתנו
          </Link>
        </div>
      </section>
    </div>
  );
}

function InitialLoadingState() {
  return (
    <div className="animate-pulse">
      {/* Add loading skeleton for home page */}
      <div className="h-[80vh] bg-gray-200" />
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 bg-gray-200 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
} 