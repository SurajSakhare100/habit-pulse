import { Navigation } from "@/components/navigation";

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
