/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00F2FE',  // Bright Cyan
          dark: '#00D4E4',    // Darker Cyan
        },
        secondary: '#ffffff',
        brand: {
          light: '#ffffff',    // Light Cyan
          DEFAULT: '#ffffff',  // Bright Cyan
          dark: '#ffffff',     // Darker Cyan
          bg: '#ffffff',      // Very Light Cyan Background
        }
      },
      fontFamily: {
        cairo: ['var(--font-cairo)'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00F2FE 0%, #4AFDFD 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00F2FE 10%, #00D4E4 100%)',
        'gradient-teal': 'linear-gradient(135deg, #4AFDFD 0%, #00D4E4 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0093E9 0%, #00D4E4 100%)',
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'body': {
          color: '#000000',  // Black text by default
        },
        'p': {
          color: '#000000',  // Black text for paragraphs
        },
        'h1, h2, h3, h4, h5, h6': {
          color: '#000000',  // Black text for headings
        },
        'span': {
          color: '#000000',  // Black text for spans
        }
      })
    }
  ],
} 