"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import Image from "next/image";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

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

  if (!session) return null;

  const navLinks = [
    { href: "/habits", label: "Habits" },
    { href: "/profile", label: "Profile" },
    { href: "/feedback", label: "Feedback" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <nav className="border-b px-4 sm:px-6 lg:px-20">
      <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
        {/* Logo and hamburger */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={require("../../public/favicon.ico")}
              className="h-8 w-8 rounded-full"
              alt="Logo"
            />
          </Link>
          {/* Hamburger menu for mobile */}
          <button
            className="sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === href
                ? "text-foreground"
                : "text-foreground/60"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={toggleTheme}
            className="px-2 sm:px-4 py-2 rounded-full bg-card text-card-foreground"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="sm:hidden mt-2 flex flex-col space-y-2 px-2 pb-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === href
                ? "text-foreground"
                : "text-foreground/60"
                }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
