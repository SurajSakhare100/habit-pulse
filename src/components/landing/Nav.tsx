"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [theme, setTheme] = useState("light");

  // Initialize theme on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
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
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl px-3 shadow-md backdrop-blur-sm bg-card/80 backdrop-saturate-150 border-card">
        <div className="flex flex-1 items-center cursor-pointer">
                      <Link href="/" className="flex items-center space-x-2">
                      <Image
                        src={require("@/public/favicon.ico")}
                        className="h-8 w-8 rounded-full"
                        alt="Logo"
                      />
                      <span className="font-bold">Habit Pulse</span>
                      </Link>
                    </div>

          <ul className="flex items-center gap-3">
            {/* Theme toggle button */}
            <Button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full bg-card text-card-foreground flex items-center space-x-2"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            {/* Auth state buttons */}
            <Button variant="outline" className="rounded-full px-4">
              <Link href="/habits">My Habits</Link>
            </Button>

            <Button className="rounded-full px-4">
              <Link href="/auth/signin" className="shadow-sm">
                Sign In
              </Link>
            </Button>
          </ul>
        </div>
      </div>
    </header>
  );
}
