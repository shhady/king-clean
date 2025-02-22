import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiPhone, FiMail, FiClock, FiMapPin } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl lg:max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-right">
              אודות King Clean
              <br />
              <span className="text-blue-100">המומחים לניקיון מקצועי</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 text-right">
              מספקים פתרונות ניקיון איכותיים לבתים, עסקים ומוסדות
            </p>
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

      <div className="container mx-auto px-4 py-12">
        {/* מי אנחנו Section */}
        <section className="mb-16">
          <div className="bg-blue-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-right">מי אנחנו</h2>
            <p className="text-xl text-gray-600 leading-relaxed text-right">
              King Clean הינה חברה מובילה בתחום מוצרי הניקיון המקצועיים, המתמחה באספקת פתרונות ניקיון 
              איכותיים ומתקדמים. אנו מאמינים שניקיון מקצועי דורש כלים מקצועיים, ולכן אנו מציעים את 
              המוצרים הטובים ביותר בשוק, יחד עם ייעוץ מקצועי וליווי אישי.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-right">השירותים שלנו</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🧹</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">מוצרי ניקיון מקצועיים</h3>
              <p className="text-gray-600">
                מגוון רחב של חומרי ניקוי, דטרגנטים, מוצרי חיטוי ומוצרי נייר באיכות גבוהה.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">ציוד וכלי ניקוי</h3>
              <p className="text-gray-600">
                מכונות שטיפה, שואבי אבק, מטאטאים, מגבים וכלי ניקוי מקצועיים.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">פתרונות לעסקים</h3>
              <p className="text-gray-600">
                פתרונות ניקיון מותאמים אישית למשרדים, מסעדות, בתי מלון ומוסדות.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">ייעוץ מקצועי</h3>
              <p className="text-gray-600">
                צוות מומחים המספק ייעוץ והדרכה בבחירת מוצרי הניקיון המתאימים ביותר.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-right">הערכים שלנו</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">איכות</h3>
              <p className="text-gray-600">
                מוצרים מהמותגים המובילים בעולם, העומדים בסטנדרטים הגבוהים ביותר
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💫</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">שירות</h3>
              <p className="text-gray-600">
                שירות לקוחות מקצועי, אדיב וזמין לכל שאלה או בקשה
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">אמינות</h3>
              <p className="text-gray-600">
                משלוחים מהירים, מחירים הוגנים ועמידה בהתחייבויות
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-right">צרו קשר</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 text-right">
              <div className="flex items-center gap-3 justify-end">
                <span className="text-gray-600">*5743</span>
                <FiPhone className="text-blue-600 text-xl" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span className="text-gray-600">info@kingclean.co.il</span>
                <FiMail className="text-blue-600 text-xl" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span className="text-gray-600">נצרת</span>
                <FiMapPin className="text-blue-600 text-xl" />
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span className="text-gray-600">ראשון-חמישי: 09:00-18:00</span>
                <FiClock className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold text-lg"
              >
                דברו איתנו
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 