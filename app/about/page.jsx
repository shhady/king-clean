import Image from 'next/image';
import { FiCheck } from 'react-icons/fi';

export default function About() {
  const features = [
    {
      title: "جودة عالية",
      description: "نقدم منتجات كريستال وأحجار كريمة بأعلى معايير الجودة"
    },
    {
      title: "استيراد مباشر",
      description: "نستورد منتجاتنا مباشرة من براغ لضمان الأصالة والجودة"
    },
    {
      title: "خدمة متميزة",
      description: "فريق خدمة عملاء محترف لمساعدتك في اختيار المنتج المناسب"
    },
    {
      title: "ضمان الجودة",
      description: "نقدم ضمان على جميع منتجاتنا لراحة بالك"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
            <p className="text-xl text-gray-600">
              نحن متجر متخصص في بيع الكريستال والأحجار الكريمة المستوردة من براغ،
              نسعى لتقديم أفضل المنتجات بأعلى جودة لعملائنا الكرام
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <p className="text-gray-600 mb-6">
                بدأت رحلتنا منذ عام 2010 في استيراد وبيع الكريستال والأحجار الكريمة من براغ.
                نحن فخورون بتقديم منتجات فريدة وعالية الجودة لعملائنا في المملكة العربية السعودية.
              </p>
              <p className="text-gray-600">
                نحرص على اختيار كل قطعة بعناية فائقة لضمان تقديم أفضل المنتجات التي تلبي تطلعات عملائنا
                وتضيف لمسة من الأناقة والفخامة لمنازلهم.
              </p>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/about-us.webp"
                alt="قصتنا"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">ما يميزنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FiCheck className="text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">قيمنا</h2>
            <p className="text-gray-600 mb-12">
              نلتزم بتقديم أفضل تجربة تسوق لعملائنا من خلال التركيز على الجودة والخدمة المتميزة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold mb-2">الجودة</h3>
              <p className="text-gray-600">نقدم أفضل المنتجات بأعلى معايير الجودة</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-2">الأمانة</h3>
              <p className="text-gray-600">نتعامل بشفافية ومصداقية مع عملائنا</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold mb-2">التميز</h3>
              <p className="text-gray-600">نسعى دائماً للتميز في كل ما نقدمه</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 