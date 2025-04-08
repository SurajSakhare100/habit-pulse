// src/app/layout.tsx

import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Habit Tracker App - Build Daily Habits with Habit Pulse',
  description: 'Habit Pulse helps you build better daily habits with a clean, simple tracker. Improve your lifestyle and productivity today.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="b7yDmUftzFJzjwP96Jv0AQ6E3alSjSkx7felqcdVwqs" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        {/* Open Graph */}
        <meta property="og:title" content="Habit Pulse - Track Your Habits" />
        <meta property="og:description" content="Track your daily habits and improve your lifestyle with Habit Pulse." />
        <meta property="og:image" content="https://habitpulse.xyz/logo.png" /> {/* Use a real logo image, not favicon */}
        <meta property="og:url" content="https://habitpulse.xyz/" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://habitpulse.xyz/" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Habit Pulse - Track Your Habits" />
        <meta name="twitter:description" content="Track your daily habits and improve your lifestyle with Habit Pulse." />
        <meta name="twitter:image" content="https://habitpulse.xyz/logo.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Habit Pulse",
              url: "https://habitpulse.xyz/",
              description: "Track and improve your habits with Habit Pulse",
              image: "https://habitpulse.xyz/logo.png",
              applicationCategory: "Lifestyle",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              }
            }),
          }}
        />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
        <Analytics />
        <Toaster />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CLCJ43DW95"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CLCJ43DW95');
          `}
        </Script>
      </body>
    </html>
  );
}
