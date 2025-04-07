import { Navigation } from "@/components/navigation";

export default function RootLayout({ children }) {
  return (
          <>
          <Navigation/>
            {children}
          </>
      
  );
}
