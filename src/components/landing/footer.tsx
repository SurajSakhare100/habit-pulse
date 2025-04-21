"use client";

import { Instagram, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ border = false }: { border?: boolean }) {
  const handleSupportClick = () => {
    window.location.href = "mailto:sakharesuraj10@gmail.com?subject=HabitPulse Support Request";
  };

  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 border-t">
        <div
          className={`grid gap-10 py-8 sm:grid-cols-12 md:py-12 ${
            border
              ? "border-t [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1]"
              : ""
          }`}
        >
          {/* Branding & Address */}
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            <span className="text-xl font-bold">Habit Pulse</span>
            <div className="text-sm text-gray-600">
              &copy; Habit Pulse - All rights reserved.
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <strong>Office:</strong> Vadgaon Road, Alandi, Pune 412105<br />
              <strong>Email:</strong> <a href="mailto:sakharesuraj10@gmail.com" className="underline">sakharesuraj10@gmail.com</a>
            </div>
          </div>

          {/* Partner Links */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Partner Projects</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="https://readspark.vercel.app/" target='_blank'>ReadSpark</Link></li>
              <li><Link href="https://relinkk.vercel.app/" target='_blank'>Relinkk</Link></li>
            </ul>
          </div>

          {/* Blog Links */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Blog Posts</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blogs/best-habit-tracking-apps">Best Habit Tracking Apps in 2025</Link></li>
              <li><Link href="/blogs/how-to-build-good-habits">Build Habits That Stick</Link></li>
              <li><Link href="/blogs/breaking-bad-habits-strategies">Breaking Bad Habits</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/about-us">About Us</Link></li>
              <li><Link href="/legal/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/legal/refund-policy">Refund Policy</Link></li>
              <li><Link href="/legal/shipping-policy">Shipping Policy</Link></li>
              <li>
                <button
                  onClick={handleSupportClick}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Mail size={16} />
                  Support
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Social</h3>
            <ul className="flex gap-3">
              <li>
                <Link href="https://x.com/habitpulse" aria-label="Twitter">
                  <svg className="h-8 w-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"></path>
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/myhabitpulse/" aria-label="Instagram">
                  <Instagram className="h-5 w-5 mt-1.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
