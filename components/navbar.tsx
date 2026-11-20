"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clock In / Out",
      href: "/attendance",
      icon: Clock,
    },
    {
      name: "Summary",
      href: "/summary",
      icon: FileSpreadsheet,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const handleLogout = () => {
    logout();
    toast.info("You have been signed out.");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5eae5] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            href="/dashboard"
          >
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#176b50] text-white shadow-sm">
              <CalendarDays className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#17261f]">
              kantor
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#e8f1ec] text-[#176b50]"
                      : "text-[#55635a] hover:bg-[#f3f6f3] hover:text-[#17261f]"
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? "text-[#176b50]" : "text-[#7f8e83]"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <Link
            href="/profile"
            className="group flex items-center gap-3 rounded-xl border border-[#e5eae5] bg-[#fafbfa] p-1.5 pr-3 transition-colors hover:border-[#176b50]/30 hover:bg-[#f3f6f3]"
          >
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-[#e2ede6] text-xs font-bold text-[#176b50]">
              {user?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo}
                  alt={user.name || "Profile"}
                  className="size-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="text-left">
              <p className="max-w-[130px] truncate text-xs font-semibold text-[#17261f]">
                {user?.name || "Employee"}
              </p>
              <p className="text-[10px] capitalize text-[#748378]">
                {user?.role || "Team Member"}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="flex size-9 items-center justify-center rounded-xl border border-[#e5eae5] text-[#69786e] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="flex size-9 items-center justify-center rounded-xl border border-[#e5eae5] text-[#55635a]"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-[#edf0ec] bg-white px-4 pt-3 pb-5 md:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#f5f8f5] p-3">
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-[#e2ede6] text-sm font-bold text-[#176b50]">
              {user?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo}
                  alt={user.name || "Profile"}
                  className="size-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-semibold text-[#17261f]">
                {user?.name || "Employee"}
              </p>
              <p className="truncate text-xs text-[#748378]">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#e8f1ec] text-[#176b50]"
                      : "text-[#55635a] hover:bg-[#f3f6f3]"
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? "text-[#176b50]" : "text-[#7f8e83]"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-[#edf0ec] pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
