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
import { Trash, ShoppingCart } from "lucide-react";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  updateQuantity,
  removeFromCart,
  setCartItems,
} from "@/lib/store/slices/cartSlice";
import { supabase } from "@/utils/supabase/client";
import { setupCartRealtime } from "@/service/realTime";
import { handleRemoveFromCart } from "@/utils/product/cart";
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

    const fetchInitialCart = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId);

      if (!error) dispatch(setCartItems(data));
    };

    fetchInitialCart();
    const cleanup = setupCartRealtime(userId, dispatch);

    return () => {
      cleanup();
    };
  }, [userId, dispatch]);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);

    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shipping);
  }, [cartItems, products, userId]);

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
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    debouncedUpdate(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      dispatch(removeFromCart(itemId));
      await handleRemoveFromCart(itemId, userId!);
    } catch (error) {
      console.error("Remove Cart Item error:", error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      handleToggleWishlist(productId);
      toast.success("Wishlist updated");
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", error);
    }
  };

  if (!userId) {
    return (
      <div className="w-full py-4 px-2 sm:px-4">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-7xl mx-auto">
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
    <div className="w-full py-4 px-2 sm:px-4">
      <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-8 max-w-7xl mx-auto">
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
                <div key={item.id} className="space-y-2">
                  <div className="flex items-start gap-3 p-2 sm:p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors shadow-sm">
                    {/* Image on left */}
                    <div className="relative w-[25%] h-full flex-shrink-0">
                      <img
                        src={product?.image_url}
                        alt={product?.name}
                        className="object-cover rounded-md w-full h-full shadow-sm"
                      />
                    </div>

                    {/* Content on right */}
                    <div className="flex-1 flex justify-between">
                      <div className="flex-1 flex flex-col gap-1 sm:gap-2">
                        {/* Name */}
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                          {product?.name}
                        </h3>

                        {/* Price */}
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          ${product?.price?.toFixed(2)}
                        </p>

                        {/* Quantity Selector */}
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

                      {/* Total Price and Remove Button */}
                      <div className="flex flex-col text-right justify-between">
                        <p className="font-semibold text-xl px-2 sm:text-lg text-primary">
                          ${itemTotal.toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="hover:bg-destructive/10 cursor-pointer px-2 py-1 flex items-center gap-1"
                        >
                          <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                          <span className="text-destructive text-xs sm:text-sm">
                            Remove from Cart
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="w-full h-fit sticky top-4">
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
