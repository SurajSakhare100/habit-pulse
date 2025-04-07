import { AuthProvider } from "@/components/auth-provider";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
          <>
            <AuthProvider>
            <Suspense>
          <main className="min-h-screen bg-background">
            {children}
          </main>
          </Suspense>
          </AuthProvider>
          </>
      
  );
}
