// import ProductCard from './ProductCard';

// export default function ProductRecommendations({ currentProductId }) {
//   // This would normally come from an API based on the current product
//   const recommendations = [
//     {
//       id: 2,
//       name: "حجر جارنت أحمر ملكي",
//       price: "850",
//       image: "/images/product2.jpg",
//     },
//     {
//       id: 3,
//       name: "مزهرية كريستال ملونة",
//       price: "650",
//       image: "/images/product3.jpg",
//     },
//     {
//       id: 4,
//       name: "ثريا كريستال كلاسيك",
//       price: "2,400",
//       image: "/images/product4.jpg",
//     }
//   ].filter(product => product.id !== parseInt(currentProductId));

//   if (recommendations.length === 0) return null;

//   return (
//     <section className="mt-16">
//       <h2 className="text-2xl font-bold mb-8">منتجات مشابهة</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {recommendations.map(product => (
//           <ProductCard
//             key={product.id}
//             name={product.name}
//             price={product.price}
//             image={product.image}
//             href={`/shop/${product.id}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// } 