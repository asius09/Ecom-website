"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function CartSummary() {
  const subtotal = 199.99;
  const shipping = 9.99;
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const total = subtotal + shipping - discount;

  const handleApplyDiscount = () => {
    // Here you would typically validate the discount code with your backend
    // For demonstration, we'll just apply a 10% discount
    if (discountCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const handlePlaceOrder = () => {
    // Place order logic here
    console.log("Placing order...");
  };

  return (
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
        <div className="flex justify-between">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <Button variant="outline" onClick={handleApplyDiscount}>
            Apply
          </Button>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}
