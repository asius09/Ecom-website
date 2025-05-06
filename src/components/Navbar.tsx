"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  User,
  Heart,
  X,
  CreditCard,
  MapPin,
  Search,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { LogOutBtn } from "./auth/LogOutBtn";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Logo } from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { setUser } from "@/lib/store/features/userSlice";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserData {
  id?: string;
  user_metadata?: {
    name?: string;
    is_admin?: boolean;
  };
  email?: string;
  created_at?: string;
}

interface MenuItem {
  type: string;
  href?: string;
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  component?: React.ReactNode;
  items?: MenuItem[];
  onClick?: () => void;
}

export function Navbar({ user }: { user: UserData | null }) {
  const isMobile: boolean = useIsMobile();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { id: user_id } = useAppSelector((state) => state.user);
  const { itemCount } = useAppSelector((state) => state.cart);
  const [userId, setUserId] = useState<string | undefined>(
    user?.id || user_id || undefined
  );
  const [cartItemCount, setCartItemCount] = useState(itemCount);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getInitialData = useCallback(
    async (userId: string | undefined) => {
      try {
        if (!userId) {
          setLoading(true);
          return;
        }

        if (user && user.id) {
          setUserId(user.id);
          dispatch(
            setUser({
              id: user.id,
              name: user.user_metadata?.name || "",
              is_admin: user.user_metadata?.is_admin || false,
              email: user.email || "",
              created_at: user.created_at || "",
            })
          );

          const [wishlistResponse, cartResponse] = await Promise.all([
            fetch(`/api/user/wishlist?userId=${user.id}`),
            fetch(`/api/user/cart?userId=${user.id}`),
          ]);

          if (!wishlistResponse.ok || !cartResponse.ok) {
            throw new Error("Failed to fetch user data");
          }

          const wishlistData = await wishlistResponse.json();
          const cartData = await cartResponse.json();

          setWishlistItemCount(wishlistData.data?.length || 0);
          setCartItemCount(cartData.data?.length || 0);
        }
      } catch (error) {
        console.error("Failed to get user data:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, user]
  );

  const mobileMenu: MenuItem[] = [
    {
      type: "dropdown",
      label: "Account",
      icon: <User className="h-5 w-5" />,
      items: [
        {
          type: "route",
          href: `/account/${userId}`,
          label: "Profile",
          icon: <User className="h-4 w-4" />,
          active: pathname.startsWith("/account"),
        },
        {
          type: "route",
          href: `/account/${userId}/address`,
          label: "Address",
          icon: <MapPin className="h-4 w-4" />,
          active: pathname.startsWith("/account/address"),
        },
        {
          type: "route",
          href: `/account/${userId}/payment`,
          label: "Payment",
          icon: <CreditCard className="h-4 w-4" />,
          active: pathname.startsWith("/account/payment"),
        },
      ],
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
      component: <LogOutBtn variant="text" />,
    },
  ];

  const rightRoutes: MenuItem[] = !isMobile
    ? [
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
          icon: (
            <div className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-700 text-[10px] text-white shadow-sm"
                  variant="default"
                >
                  {wishlistItemCount}
                </Badge>
              )}
            </div>
          ),
          active: pathname.startsWith("/wishlist"),
        },
        {
          type: "route",
          href: `/cart/${userId}`,
          label: "Cart",
          icon: (
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-700 text-[10px] text-white shadow-sm"
                  variant="default"
                >
                  {cartItemCount}
                </Badge>
              )}
            </div>
          ),
          active: pathname.startsWith("/cart"),
        },
      ]
    : [
        {
          type: "button",
          label: "search",
          icon: <Search className="h-5 w-5 text-primary" />,
          onClick: (): void => {
            setSearchOpen(true);
            setMobileMenuOpen(false);
          },
        },
        {
          type: "route",
          href: `/cart/${userId}`,
          label: "Cart",
          icon: (
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-700 text-[10px] text-white shadow-sm"
                  variant="default"
                >
                  {cartItemCount}
                </Badge>
              )}
            </div>
          ),
          active: pathname.startsWith("/cart"),
        },
      ];

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/signup" && !userId) {
      getInitialData(userId);
    }
  }, [pathname, userId, getInitialData]);

  useEffect(() => {
    setCartItemCount(itemCount);
  }, [itemCount]);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  if (loading && !userId) {
    return (
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px极6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
          <div className="flex-1 mx-8 max-w-md">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h极10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
        {isMobile && searchOpen ? (
          <div className="flex flex-1 w-full items-center gap-2">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full max-h-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0 hover:bg-transparent"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <Logo />
            </div>

            <div className="hidden flex-1 mx-8 max-w-md md:block">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full max-h-10"
              />
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {userId ? (
                rightRoutes.map((route) => (
                  <Button
                    key={route.label}
                    variant="ghost"
                    size="icon"
                    className={`relative cursor-pointer`}
                    asChild
                    onClick={route.onClick}
                  >
                    {route.href ? (
                      <Link href={route.href}>{route.icon}</Link>
                    ) : (
                      route.icon
                    )}
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

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                <Menu className="h-12 w-12" />
              </Button>

              {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
                  <div className="absolute top-0 right-0 h-[100dvh] w-72 bg-background border-l shadow-lg animate slide-in">
                    <div className="flex justify-end pr-4 pt-4">
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
                            <div
                              key={item.label || "theme-button"}
                              className="p-4"
                            >
                              {item.component}
                            </div>
                          );
                        }
                        return item.href ? (
                          <Link
                            key={item.href || item.label || "mobile-menu-item"}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:bg-accent/50 p-4 text-foreground flex items-center gap-2"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ) : (
                          <div
                            key={item.label || "mobile-menu-item"}
                            className="text-sm font-medium transition-colors hover:bg-accent/50 p-4 text-foreground flex items-center gap-2"
                          >
                            {item.icon}
                            {item.label}
                          </div>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
