"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

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

  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="w-full z-50">
      <div className="fixed w-full top-0 z-[9999] bg-secondary px-4 py-1.5 text-center text-sm text-neutral-content shadow-lg">🏗️ Habit Pulse is in beta. Get the early adopter price!</div>
      <div className="mx-auto max-w-6xl px-4 mt-10 sm:px-6 md:mt-14">
        <div className="flex h-14 items-center bg-secondary justify-between gap-3 rounded-2xl px-3 shadow-md backdrop-blur-sm bg-card/80 backdrop-saturate-150 border-card">
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
            <Button variant="ghost" className="rounded-full px-4">
              <Link href="/blogs">Blogs</Link>
            </Button>

            <Button variant="ghost" className="rounded-full px-4">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button onClick={toggleTheme} className="rounded-full bg-card text-card-foreground flex items-center space-x-2">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/habits')}>
                    My Habits
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="rounded-full px-4">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
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
            
            <Button variant="ghost" className="w-full justify-start">
              <Link href="/blogs" onClick={() => setMobileMenuOpen(false)}>Blogs</Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start">
              <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            </Button>

            {session ? (
              <>
                <div className="flex items-center space-x-4 px-4 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Button variant="ghost" className="w-full justify-start" onClick={() => {
                  router.push('/habits');
                  setMobileMenuOpen(false);
                }}>
                  My Habits
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button className="w-full justify-start">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
