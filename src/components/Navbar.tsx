"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  User,
  Heart,
  ChevronDown,
  Truck,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/context/SupabaseProvider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutBtn } from "./auth/LogOutBtn";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const { user, isLoading } = useSupabase();
  const [cartItems, setCartItems] = useState<number>(0);

  const categories = [
    { name: "Electronics", href: "/categories/electronics" },
    { name: "Clothing", href: "/categories/clothing" },
    { name: "Home & Kitchen", href: "/categories/home-kitchen" },
    { name: "Sports & Outdoors", href: "/categories/sports-outdoors" },
  ];

  const mobileMenu = [
    {
      type: "route",
      href: "/account",
      label: "Account",
      icon: <User className="h-5 w-5" />,
      active: pathname === "/account/new",
    },
    {
      type: "dropdown",
      label: "Categories",
      dropdownIcon: <ChevronDown className="h-5 w-5" />,
      items: categories,
      icon: <ShoppingBag className="h-5 w-5" />,
      active: pathname.startsWith("/categories"),
    },
    {
      type: "route",
      href: "/orders",
      label: "Orders",
      icon: <Truck className="h-5 w-5" />,
      active: pathname === "/orders/new",
    },
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

  const leftRoutes = [
    {
      type: "dropdown",
      label: "Categories",
      active: pathname.startsWith("/categories"),
      items: categories,
    },
    {
      type: "route",
      href: "/orders",
      label: "Orders",
      active: pathname === "/orders",
    },
  ];

  const rightRoutes = [
    {
      href: "/account/new",
      label: "Account",
      icon: <User className="h-5 w-5" />,
      active: pathname === "/account",
      className: "hidden md:flex",
    },
    {
      href: "/wishlist/new",
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
      active: pathname === "/wishlist/new",
      className: "hidden md:flex",
    },
    {
      href: "/cart",
      label: "Cart",
      icon: (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-0.5 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5">
            {cartItems}
          </span>
        </>
      ),
      active: pathname === "/cart",
    },
  ];

  if (pathname === "/login" || pathname === "/signup") return null;

  if (isLoading) {
    return (
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-6">
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
            className="pl-2 md:pl-0 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            MyShop
          </Link>

          {/* Main navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {leftRoutes.map((route) =>
              route.type === "dropdown" ? (
                <DropdownMenu
                  key={route.label}
                  onOpenChange={setCategoriesOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-sm font-medium transition-colors text-primary"
                      )}
                    >
                      {route.label}
                      <ChevronDown
                        className={cn(
                          "ml-2 h-4 w-4 transition-transform",
                          categoriesOpen ? "rotate-180" : ""
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {route.items?.map((category) => (
                      <DropdownMenuItem
                        key={`category-${category.href}`}
                        asChild
                      >
                        <Link href={category.href}>{category.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={route.href}
                  href={route.href!}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-foreground"
                  )}
                >
                  {route.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full"
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
                className={`relative ${route.className}`}
                asChild
              >
                <Link href={route.href}>{route.icon}</Link>
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
                    switch (item.type) {
                      case "dropdown":
                        return (
                          <div
                            key={`mobile-dropdown-${item.label}`}
                            className="flex flex-col"
                          >
                            <Button
                              variant="ghost"
                              className="text-sm font-medium transition-colors hover:bg-accent/50 px-5 py-6 justify-start flex items-center gap-2 text-foreground"
                              onClick={() => setCategoriesOpen(!categoriesOpen)}
                              aria-expanded={categoriesOpen}
                            >
                              {item.icon}
                              {item.label}
                              <ChevronDown
                                className={cn(
                                  "ml-auto h-4 w-4 transition-transform",
                                  categoriesOpen ? "rotate-180" : ""
                                )}
                              />
                            </Button>
                            {categoriesOpen && item.items && (
                              <div className="p-4">
                                {item.items.map((category) => (
                                  <Link
                                    key={`mobile-category-${category.href}`}
                                    href={category.href!}
                                    className="text-sm font-medium transition-colors hover:bg-accent/50 p-4 block text-foreground rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {category.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      case "button":
                        return (
                          <div key={item.label} className="p-4">
                            {item.component}
                          </div>
                        );
                      default:
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
                    }
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
