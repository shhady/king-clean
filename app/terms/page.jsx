export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">תנאי שימוש באתר</h1>
      
      <div className="prose prose-lg max-w-none text-right">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">כללי</h2>
          <p className="text-gray-600 leading-relaxed">
            ברוכים הבאים לאתר King Clean. השימוש באתר ובשירותים המוצעים בו כפוף לתנאי השימוש המפורטים להלן. 
            גלישה באתר ו/או רכישת מוצרים באמצעותו מהווה הסכמה מצדך לתנאי השימוש.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">רכישת מוצרים</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>הרכישה באתר מיועדת ללקוחות פרטיים בלבד</li>
            <li>המחירים באתר כוללים מע"מ</li>
            <li>התמונות באתר להמחשה בלבד</li>
            <li>החברה רשאית לשנות מחירים ללא הודעה מוקדמת</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">משלוחים</h2>
          <p className="text-gray-600 leading-relaxed">
            משלוח חינם בקנייה מעל 200 ₪. זמני אספקה: 2-5 ימי עסקים.
            המשלוח יתבצע לכתובת שהוזנה בעת ביצוע ההזמנה.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">החזרות והחלפות</h2>
          <p className="text-gray-600 leading-relaxed">
            ניתן להחזיר מוצרים תוך 14 יום מיום קבלתם, בתנאי שלא נפתחו ולא נעשה בהם שימוש.
            ההחזרה תתבצע בתיאום מראש מול שירות הלקוחות.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">פרטיות ואבטחה</h2>
          <p className="text-gray-600 leading-relaxed">
            אנו מתחייבים לשמור על פרטיות הלקוחות ולא להעביר מידע אישי לגורמים שלישיים,
            למעט במקרים הנדרשים להשלמת הזמנה או על פי דרישת החוק.
          </p>
        </section>
      </div>
    </div>
  );
} 