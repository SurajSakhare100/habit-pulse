import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
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
          
          <>
          <Navigation />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          </>
      
  );
}
