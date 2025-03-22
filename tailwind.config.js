/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode using the 'class' strategy, matching the CSS's use of '.dark'
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // If using the App Router (Next.js 13+)
  ],

  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'secondary-bg': 'var(--secondary-bg)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      // Set the default border radius to use the --radius variable
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
    },
  },

  // No additional plugins are specified, so keep it empty
  plugins: [],
}
