"use client";

import { useAppSelector } from "@/lib/hooks";
import { CartItem } from "@/components/cart/CartItem";

export function CartList() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.products.products);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => {
          const product = products.find((p) => p.id === item.product_id);

          return <CartItem key={item.id} item={item} product={product} />;
        })
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You have no items in your cart
          </p>
        </div>
      )}
    </div>
  );
}
