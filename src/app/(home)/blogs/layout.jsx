import { AuthProvider } from "@/components/auth-provider";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/Nav";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
          <>
          <Header />
          <main className="min-h-screen max-w-4xl mx-auto pt-20">
            {children}
          </main>
          <Footer/>
          </>
      
  );
}
