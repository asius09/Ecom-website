"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  User,
  Heart,
  Truck,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/context/SupabaseProvider";
import { LogOutBtn } from "./auth/LogOutBtn";
import { useAppSelector } from "@/lib/hooks";

interface MenuItem {
  type: string;
  href?: string;
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  component?: React.ReactNode;
  className?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isLoading } = useSupabase();

  const { id: userId, is_admin: isAdmin } = useAppSelector(
    (state) => state.user
  );
  const { itemCount: cartItems } = useAppSelector((state) => state.cart);

  const mobileMenu: MenuItem[] = [
    {
      type: "route",
      href: `/account/${userId}`,
      label: "Account",
      icon: <User className="h-5 w-5" />,
      active: pathname.startsWith("/account"),
    },
    {
      type: "route",
      href: `/wishlist/${userId}`,
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
      active: pathname.startsWith("/wishlist"),
    },
    ...(isAdmin
      ? [
          {
            type: "route",
            href: "/admin",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            active: pathname.startsWith("/admin"),
          },
        ]
      : []),
    {
      type: "button",
      label: "Theme",
      component: <ModeToggle label={true} />,
    },
    {
      type: "button",
      component: <LogOutBtn variant="text" />,
    },
  ];

  const rightRoutes: MenuItem[] = [
    {
      type: "route",
      href: `/account/${userId}`,
      label: "Account",
      icon: <User className="h-5 w-5" />,
      active: pathname.startsWith("/account"),
      className: "hidden md:flex",
    },
    {
      type: "route",
      href: `/wishlist/${userId}`,
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
      active: pathname.startsWith("/wishlist"),
      className: "hidden md:flex",
    },
    ...(isAdmin
      ? [
          {
            type: "route",
            href: "/admin",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            active: pathname.startsWith("/admin"),
            className: "hidden md:flex",
          },
        ]
      : []),
    {
      type: "route",
      href: `/cart/${userId}`,
      label: "Cart",
      icon: (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-0.5 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5">
            {cartItems}
          </span>
        </>
      ),
      active: pathname.startsWith("/cart"),
    },
  ];

  if (pathname === "/login" || pathname === "/signup") return null;

  if (isLoading) {
    return (
      <header className="border-b sticky top-0 z极50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap极6">
            <Link
              key="logo-link"
              href="/"
              className="pl-2 md:pl-0 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              MyShop
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            key="logo-link"
            href="/"
            className="pl-3 md:pl-0 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            MyShop
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full max-h-10"
          />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            rightRoutes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                size="icon"
                className={`relative ${route.className || ""}`}
                asChild
              >
                <Link href={route.href!}>{route.icon}</Link>
              </Button>
            ))
          ) : (
            <div className="flex items-center gap-1 font-semibold text-sm">
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </div>
          )}

          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
              <div className="absolute top-0 right-0 h-[100dvh] w-72 bg-background border-l shadow-lg animate slide-in">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-foreground cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X />
                  </Button>
                </div>
                <nav className="flex flex-col py-4 space-y-2">
                  {mobileMenu.map((item) => {
                    if (item.type === "button") {
                      return (
                        <div key={item.label || "theme-button"} className="p-4">
                          {item.component}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href!}
                        className="text-sm font-medium transition-colors hover:bg-accent/50 p-4 text-foreground flex items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
