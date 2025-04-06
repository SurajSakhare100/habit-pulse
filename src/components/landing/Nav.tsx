"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // 👈 Get auth session
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="fixed top-2 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl px-3 shadow-xl backdrop-blur-sm bg-card/80 backdrop-saturate-150 border-card">
          <div className="flex flex-1 items-center">
            <Image
              src={require("@/public/favicon.ico")}
              className="rounded-full"
              alt="Logo"
              width={30}
              height={30}
            />
            <span className="ml-2 text-xl font-bold">Habit Pulse</span>
          </div>

          <ul className="flex flex-1 items-center justify-end gap-3">
            <Button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full bg-card text-card-foreground flex items-center space-x-2"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            {/* Show based on auth state */}
            {status === "loading" ? null : session ? (
              <>
                <Button className="rounded-full px-4"
                  variant="outline"
                  >
                  <Link href="/habits">My Habits</Link>
                </Button>
                <Button
                  onClick={() => signOut()}
                  className="rounded-full px-4"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button className="rounded-full px-4">
                <Link href="/auth/signin" className="shadow-sm">
                  Sign In
                </Link>
              </Button>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
