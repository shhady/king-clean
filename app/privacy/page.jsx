export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">מדיניות פרטיות</h1>
      
      <div className="prose prose-lg max-w-none text-right">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">מבוא</h2>
          <p className="text-gray-600 leading-relaxed">
            אנו ב-King Clean מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך.
            מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">איסוף מידע</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            אנו אוספים מידע כאשר אתה:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>נרשם לאתר</li>
            <li>מבצע רכישה</li>
            <li>מתקשר עם שירות הלקוחות</li>
            <li>נרשם לניוזלטר</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">סוגי מידע שנאסף</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>שם מלא</li>
            <li>כתובת דואר אלקטרוני</li>
            <li>מספר טלפון</li>
            <li>כתובת למשלוח</li>
            <li>פרטי תשלום (מאובטחים)</li>
            <li>היסטוריית רכישות</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">שימוש במידע</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            אנו משתמשים במידע שנאסף כדי:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>לספק את המוצרים והשירותים שהזמנת</li>
            <li>לשפר את השירות שלנו</li>
            <li>לשלוח עדכונים על הזמנות</li>
            <li>לשלוח חומרים שיווקיים (בהסכמתך)</li>
            <li>למנוע הונאות ולאבטח את האתר</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">אבטחת מידע</h2>
          <p className="text-gray-600 leading-relaxed">
            אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלך, כולל הצפנת SSL,
            אבטחת שרתים, ומערכות הגנה מפני פריצות. פרטי התשלום שלך מאובטחים
            באמצעות מערכות תשלום מוכרות ומאובטחות.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">שיתוף מידע</h2>
          <p className="text-gray-600 leading-relaxed">
            איננו מוכרים או משכירים את המידע האישי שלך לצדדים שלישיים.
            אנו משתפים מידע רק עם ספקי שירות הכרחיים (כגון חברות משלוחים)
            לצורך אספקת השירותים שהזמנת.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">זכויותיך</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>הזכות לעיין במידע שנאסף עליך</li>
            <li>הזכות לתקן מידע לא מדויק</li>
            <li>הזכות למחוק את המידע שלך</li>
            <li>הזכות לבטל הסכמה לקבלת דיוור</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">יצירת קשר</h2>
          <p className="text-gray-600 leading-relaxed">
            לכל שאלה או בקשה בנוגע למדיניות הפרטיות, ניתן ליצור קשר:
            <br />
            טלפון: *5743
            <br />
            דוא"ל: privacy@kingclean.co.il
          </p>
        </section>

        <section className="mb-8">
          <p className="text-gray-500 text-sm">
            עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
          </p>
        </section>
      </div>
    </div>
  );
} 