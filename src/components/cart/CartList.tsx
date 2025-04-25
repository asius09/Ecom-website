"use client";

import { CartItem } from "./CartItem";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export function CartList() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Product 1",
      price: 49.99,
      quantity: 1,
      imageUrl: "/images/product1.jpg",
    },
    {
      id: "2",
      name: "Product 2",
      price: 29.99,
      quantity: 2,
      imageUrl: "/images/product2.jpg",
    },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
          quantity={item.quantity}
          imageUrl={item.imageUrl}
          onRemove={handleRemoveItem}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </div>
  );
}
