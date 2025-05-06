"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { CartList } from "@/components/cart/CartList";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.itemCount);

  if (cartItems === 0) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            <span className="text-muted-foreground">
              Looks like you haven&apos;t added any items to your cart yet.
            </span>
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          <CartList />
        </div>
        <div className="sticky top-4 h-fit">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
