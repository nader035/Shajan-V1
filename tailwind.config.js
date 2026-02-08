/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'Marsa-maroon': '#4a0404', // العنابي الملكي
        'Marsa-gold': '#c5a059', // الذهبي المطفي
        'Marsa-dark': '#120202', // أسود بلمحة عنابية للخلفية
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'], // للمقولات الإنجليزية
        arabic: ['"Amiri"', 'serif'], // للأغاني العربية
        sans: ['"Inter"', 'sans-serif'], // لخط الواجهة الأساسي
      },
    },
  },
  plugins: [],
};
