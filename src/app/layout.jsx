import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], display: "swap" }); 
export const metadata = {
  title: "Habit Pulse",
  description: "Track your daily habits and improve your lifestyle.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="b7yDmUftzFJzjwP96Jv0AQ6E3alSjSkx7felqcdVwqs" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Track your daily habits and improve your lifestyle with Habit Pulse" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Habit Pulse - Track Your Habits" />
        <meta property="og:description" content="Track your daily habits and improve your lifestyle with Habit Pulse." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://myhabitpulse.vercel.app/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Habit Pulse - Track Your Habits" />
        <meta name="twitter:description" content="Track your daily habits and improve your lifestyle with Habit Pulse." />
        <meta name="twitter:image" content="/images/og-image.jpg" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Habit Pulse",
              "url": "https://myhabitpulse.vercel.app/",
              "description": "Track and improve your habits with Habit Pulse",
              "image": "https://myhabitpulse.vercel.app/images/og-image.jpg",
              "applicationCategory": "Lifestyle",
              "operatingSystem": "Web",
            }),
          }}
        />

        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
      </head>

      <body className={inter.className}>
      <AuthProvider>
      
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Analytics />
          <Toaster />
      </AuthProvider>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-CLCJ43DW95"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date());

  gtag('config', 'G-CLCJ43DW95');
</script>
      </body>
    </html>
  );
}
