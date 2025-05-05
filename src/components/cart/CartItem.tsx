"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { QuantitySelector } from "./QuantitySelector";
import Image from "next/image";
import { Product } from "@/types/product";
import { CartItem as CartItemType } from "@/types/cartItem";
import { Card } from "@/components/ui/card";
import {
  handleRemoveFromCart,
  handleUpdateCartQuantity,
} from "@/utils/product/cart";
import { useAppDispatch } from "@/lib/hooks";
import { debounce } from "@/utils/debounce";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  product: Product | undefined;
}

export function CartItem({ item, product }: CartItemProps) {
  const dispatch = useAppDispatch();
  const itemTotal = (product?.price || 0) * item.quantity;
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const onRemove = async (cartItem: CartItemType) => {
    try {
      await handleRemoveFromCart(cartItem, dispatch);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const debouncedQuantityChange = debounce(
    async (cartItem: CartItemType, qty: number) => {
      try {
        const newQuantity = quantity + qty;
        console.log(
          `Updating quantity for item ${cartItem.id} to ${newQuantity}`
        );
        await handleUpdateCartQuantity(cartItem, newQuantity, dispatch);
        console.log(`Successfully updated quantity for item ${cartItem.id}`);
      } catch (error) {
        console.error("Failed to update the quantity: ", error);
      }
    },
    300
  );

  const onQuantityChange = async (cartItem: CartItemType, qty: number) => {
    console.log(
      `Quantity change triggered for item ${cartItem.id}, delta: ${qty}`
    );
    setQuantity((prev) => {
      const newQty = prev + qty;
      console.log(`Local quantity updated from ${prev} to ${newQty}`);
      return newQty;
    });
    debouncedQuantityChange(cartItem, qty);
  };

  return (
    <Card className="w-full p-4 hover:shadow-lg transition-all duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Image Section */}
        <div className="w-24 h-24 sm:w-20 sm:h-20 relative rounded-lg overflow-hidden border shrink-0">
          {product?.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 100vw, 20vw"
            />
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-base line-clamp-2">
            {product?.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            ${product?.price?.toFixed(2)} each
          </p>
        </div>

        {/* Controls Section */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onQuantityChange(item, 1)}
            onDecrease={() => onQuantityChange(item, -1)}
            min={1}
            max={99}
          />

          <div className="w-20 text-right sm:order-2">
            <p className="text-base font-semibold">${itemTotal.toFixed(2)}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item)}
            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg sm:order-3 cursor-pointer"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
