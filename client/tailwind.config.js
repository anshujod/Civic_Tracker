export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          brand: {
            50: '#eef6ff',
            100: '#d9ecff',
            500: '#2563eb',  // primary
            600: '#1d4ed8',
          },
        },
      },
    },
    plugins: [],
  };