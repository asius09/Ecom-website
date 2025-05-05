"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { supabase } from "@/utils/supabase/client";
import { handleAddToCart } from "@/utils/product/cart";
import Link from "next/link";
import { setCartItems } from "@/lib/store/features/cartSlice";
import { CartList } from "@/components/cart/CartList";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    if (!userId) return;

    const fetchInitialCart = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId);

      if (!error) dispatch(setCartItems(data));
    };

    fetchInitialCart();
  }, [userId, dispatch]);

  const handleRemoveItem = async (itemId: string) => {
    try {
      // await handleRemoveFromCart(itemId, userId!, dispatch);
    } catch (error) {
      console.error("Remove Cart Item error:", error);
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number = 1) => {
    try {
      await handleAddToCart(itemId, userId!, dispatch, quantity);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  if (!userId) {
    return (
      <div className="w-full py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-6 border rounded-lg">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added any items to your cart yet.
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
          <CartList
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
        </div>
        <div className="sticky top-4 h-fit">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
