import { Rubik } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';

const rubik = Rubik({
  subsets: ['hebrew'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'King Clean | מוצרי ניקיון מקצועיים',
  description: 'חנות מקוונת למוצרי ניקיון איכותיים לבית, למשרד ולעסק. מגוון רחב של חומרי ניקוי, כלי ניקוי ומוצרים מקצועיים במחירים משתלמים.',
  keywords: [
    'מוצרי ניקיון',
    'חומרי ניקוי',
    'כלי ניקוי',
    'ניקיון מקצועי',
    'מוצרי ניקוי לבית',
    'מוצרי ניקוי למשרד',
    'חומרי ניקוי מקצועיים',
    'king clean',
    'קינג קלין'
  ].join(', '),
  openGraph: {
    title: 'King Clean | מוצרי ניקיון מקצועיים',
    description: 'חנות מקוונת למוצרי ניקיון איכותיים לבית, למשרד ולעסק',
    images: ['/og-image.jpg'],
    locale: 'he_IL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  dir: 'rtl',
  lang: 'he',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <ClerkProvider>
        <UserProvider>
          <body className="min-h-screen flex flex-col bg-gray-50">
            <OrderProvider>
              <CartProvider>
                <WishlistProvider>
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                  <Cart />
                  <Toaster 
                    position="top-center"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: '#2563eb',
                        color: '#fff',
                        fontFamily: 'var(--font-heebo)',
                      },
                      success: {
                        iconTheme: {
                          primary: '#fff',
                          secondary: '#2563eb',
                        },
                      },
                      error: {
                        style: {
                          background: '#ef4444',
                        },
                        iconTheme: {
                          primary: '#fff',
                          secondary: '#ef4444',
                        },
                      },
                    }}
                  />
                </WishlistProvider>
              </CartProvider>
            </OrderProvider>
          </body>
        </UserProvider>
      </ClerkProvider>
    </html>
  );
} 