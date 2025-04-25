"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface QuantitySelectorProps {
  initialQuantity: number;
  min?: number;
  max?: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onQuantityChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrement = () => {
    const newQuantity = Math.max(min, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = Math.min(max, quantity + 1);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
}
