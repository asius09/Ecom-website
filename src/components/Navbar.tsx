"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, User, Heart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { LogOutBtn } from "./auth/LogOutBtn";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Logo } from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { setUser } from "@/lib/store/features/userSlice";

interface MenuItem {
  type: string;
  href?: string;
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  component?: React.ReactNode;
  className?: string;
}

export function Navbar({ user }: { user: any }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { id: user_id } = useAppSelector((state) => state.user);
  const [userId, setUserId] = useState<string | undefined>(user?.id);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getInitialData = async () => {
    try {
      if (!userId) {
        setLoading(true);
      }
      if (user) {
        setUserId(user?.id);

        dispatch(
          setUser({
            id: user?.id,
            name: user?.user_metadata.name,
            is_admin: user?.user_metadata.is_admin,
            email: user?.email,
            created_at: user?.created_at,
          })
        );

        const [wishlistResponse, cartResponse] = await Promise.all([
          fetch(`/api/user/wishlist?userId=${user.id}`),
          fetch(`/api/user/cart?userId=${user.id}`),
        ]);

        if (wishlistResponse.status !== 200 || cartResponse.status !== 200) {
          throw new Error("Failed to fetch user data");
        }

        const { wishlistRes } = await wishlistResponse.json();
        const { cartRes } = await cartResponse.json();

        setWishlistItemCount(wishlistRes?.length || 0);
        setCartItemCount(cartRes?.length || 0);
      }
    } catch (error) {
      throw new Error("Failed to get user data: " + error);
    } finally {
      setLoading(false);
    }
  };

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
      icon: (
        <>
          <Heart className="h-5 w-5" />
          {wishlistItemCount !== 0 ? (
            <span className="absolute -top-1 -right-0.5 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5">
              {wishlistItemCount}
            </span>
          ) : null}
        </>
      ),
      active: pathname.startsWith("/wishlist"),
      className: "hidden md:flex",
    },
    {
      type: "route",
      href: `/cart/${userId}`,
      label: "Cart",
      icon: (
        <>
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount !== 0 ? (
            <span className="absolute -top-1 -right-0.5 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5">
              {cartItemCount}
            </span>
          ) : null}
        </>
      ),
      active: pathname.startsWith("/cart"),
    },
  ];

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/signup" && !userId) {
      getInitialData();
    }
  }, [pathname, user]);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  if (loading && !userId) {
    return (
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
          <div className="flex-1 mx-8 max-w-md">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        <div className="flex-1 mx-8 max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full max-h-10"
          />
        </div>

        <div className="flex items-center gap-4">
          {userId ? (
            rightRoutes.map((route) => {
              return (
                <Button
                  key={route.href}
                  variant="ghost"
                  size="icon"
                  className={`relative ${route.className || ""}`}
                  asChild
                >
                  <Link href={route.href!}>{route.icon}</Link>
                </Button>
              );
            })
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

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
              <div className="absolute top-0 right-0 h-[100dvh] w-72 bg-background border-l shadow-lg animate slide-in">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-foreground cursor-pointer"
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
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
