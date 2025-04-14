import { Navigation } from "@/components/navigation";

export default function RootLayout({ children }) {
  return (
          <div className="">
          <Navigation/>
            {children}
          </div>
      
  );
}
