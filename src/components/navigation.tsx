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
import { Moon, Sun } from "lucide-react";
import Image from "next/image";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
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

  if (!session) return null;

  return (
    <nav className="border-b px-20">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
           <div className="flex flex-1 items-center cursor-pointer">
                      <Link href="/">
                      <Image
                        src={require("../../public/favicon.ico")}
                        className="h-8 w-8 rounded-full"
                        alt="Logo"
                      />
                      </Link>
                    </div>

          <Link
            href="/habits"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/habits" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Habits
          </Link>
          <Link
            href="/profile"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/profile" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Profile
          </Link>
          <Link
            href="/feedback"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "feedback" ? "text-foreground" : "text-foreground/60"
            }`}
        
          >
            feedback
          </Link>
          <Link
            href="/analytics"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/analytics" ? "text-foreground" : "text-foreground/60"
            }`}
        
          >
            Analytics
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full bg-card text-card-foreground flex items-center space-x-2"
            >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20}/>}
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
    </nav>
  );
}
