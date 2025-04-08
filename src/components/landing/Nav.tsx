"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="fixed top-2 w-full z-50 md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl px-3 shadow-md backdrop-blur-sm bg-card/80 backdrop-saturate-150 border-card">
          {/* Logo */}
          <div className="flex flex-1 items-center cursor-pointer">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={require("../../../public/favicon.ico")}
                className="h-8 w-8 rounded-full"
                alt="Logo"
              />
              <span className="font-bold">Habit Pulse</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <ul className="hidden sm:flex items-center gap-3">
            <Button  onClick={toggleTheme} className="rounded-full bg-card text-card-foreground flex items-center space-x-2">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            <Button variant="outline" className="rounded-full px-4">
              <Link href="/habits">My Habits</Link>
            </Button>

            <Button className="rounded-full px-4">
              <Link href="/auth/signin" className="shadow-sm">
                Sign In
              </Link>
            </Button>
          </ul>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 bg-card/90 backdrop-blur-md rounded-xl shadow-lg p-4 space-y-3 border">
            <Button variant="outline" onClick={toggleTheme} className="w-full justify-start">
              {theme === "light" ? <Moon className="mr-2" /> : <Sun className="mr-2" />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Link href="/habits" onClick={() => setMobileMenuOpen(false)}>My Habits</Link>
            </Button>
            <Button className="w-full justify-start">
              <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
