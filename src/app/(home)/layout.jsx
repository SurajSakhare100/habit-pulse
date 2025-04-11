import { Navigation } from "@/components/navigation";
import Header from "@/components/landing/Nav";
import Footer from "@/components/landing/footer";
export default function RootLayout({ children }) {
  return (
          <>
          <Header/>
            {children}
            <Footer/>
          </>
      
  );
}
