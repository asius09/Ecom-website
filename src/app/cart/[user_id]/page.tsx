"use client";

import { useEffect, useCallback, useState } from "react";
import { debounce } from "@/utils/debounce";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Trash, ShoppingCart } from "lucide-react";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  updateQuantity,
  removeFromCart,
  setCartItems,
} from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { supabase } from "@/utils/supabase/client";
import { setupCartRealtime } from "@/service/realTime";
import {
  handleRemoveFromCart,
  handleAddToCart,
  handleUpdateCartQuantity,
} from "@/utils/product/cart";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.products.products);
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 9.99;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // 1. Fetch initial cart data
    const fetchInitialCart = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId);

      if (!error) dispatch(setCartItems(data));
    };

    fetchInitialCart();

    // 2. Setup realtime subscription
    const cleanup = setupCartRealtime(userId, dispatch);

    return () => {
      cleanup(); // Cleanup on unmount
    };
  }, [userId, dispatch]);

  // Calculate totals
  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);

    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shipping);
  }, [cartItems, products, userId]);

  // Debounced quantity update
  const debouncedUpdate = useCallback(
    debounce(async (itemId: string, newQuantity: number) => {
      try {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", itemId);

        if (error) throw error;
        toast.success("Quantity updated");
      } catch (error) {
        toast.error("Failed to update quantity");
        console.error("Update error:", error);
      }
    }, 500),
    []
  );

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Optimistic update
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    // Debounced server update
    debouncedUpdate(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      // Optimistic update
      dispatch(removeFromCart(itemId));
      await handleRemoveFromCart(itemId, userId!);
    } catch (error) {
      console.error("Remove Cart Item error:", error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      handleToggleWishlist(productId);
      // dispatch(toggleWishlist(user_id!, productId));
      toast.success("Wishlist updated");
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", error);
    }
  };

  if (!userId) {
    return (
      <div className="w-full py-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-8 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="w-full">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products">
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
    <div className="w-full py-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} items in your cart
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {cartItems.map((item) => {
              const product = products.find((p) => p.id === item.product_id);
              const itemTotal = (product?.price || 0) * item.quantity;

              return (
                <div key={item.id} className="space-y-4">
                  <div className="flex items-center gap-6 p-6 border rounded-xl bg-card hover:bg-accent/50 transition-colors">
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <img
                        src={product?.image_url}
                        alt={product?.name}
                        className="object-cover rounded-lg w-full h-full shadow-sm"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {product?.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          ${product?.price?.toFixed(2)}
                        </p>
                      </div>

                      <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        onDecrease={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        min={1}
                        max={99}
                      />
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <p className="font-semibold text-lg">
                        ${itemTotal.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-xl font-bold">Order Summary</h2>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
