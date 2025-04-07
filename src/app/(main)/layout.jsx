import { Navigation } from "@/components/navigation";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
          
          <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          </Suspense>
      
  );
}
