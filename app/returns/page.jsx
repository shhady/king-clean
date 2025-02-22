export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">מדיניות החזרות והחלפות</h1>
      
      <div className="prose prose-lg max-w-none text-right">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">תנאים כלליים</h2>
          <p className="text-gray-600 leading-relaxed">
            אנו ב-King Clean מחויבים לשביעות רצון מלאה של לקוחותינו. 
            ניתן להחזיר או להחליף מוצרים בהתאם לתנאים המפורטים להלן.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">זמן החזרה</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>ניתן להחזיר מוצרים תוך 14 יום מיום קבלת ההזמנה</li>
            <li>המוצר חייב להיות באריזתו המקורית</li>
            <li>המוצר חייב להיות ללא שימוש</li>
            <li>יש לשמור על חשבונית הקנייה</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">אופן ביצוע החזרה</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>יש ליצור קשר עם שירות הלקוחות בטלפון *5743</li>
            <li>נציג השירות יתאם איסוף של המוצר מכתובתך</li>
            <li>יש לארוז את המוצר באריזתו המקורית</li>
            <li>החזר כספי יתבצע באמצעי התשלום המקורי תוך 14 ימי עסקים</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">מוצרים שלא ניתן להחזיר</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>מוצרים שנפתחו או נעשה בהם שימוש</li>
            <li>מוצרים שנרכשו במבצע מיוחד</li>
            <li>מוצרים בהזמנה מיוחדת</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">החלפת מוצרים</h2>
          <p className="text-gray-600 leading-relaxed">
            ניתן להחליף מוצר במוצר אחר בעל ערך זהה או גבוה יותר (בתוספת תשלום).
            החלפת המוצר תתבצע בתיאום מול שירות הלקוחות.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">עלויות משלוח</h2>
          <p className="text-gray-600 leading-relaxed">
            במקרה של החזרת מוצר פגום או שגוי - עלות המשלוח על חשבוננו.
            במקרה של החזרה מכל סיבה אחרת - עלות המשלוח על חשבון הלקוח.
          </p>
        </section>
      </div>
    </div>
  );
} 