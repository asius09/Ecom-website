"use client";

import { CartList } from "@/components/cart/CartList";
import { CartSummary } from "@/components/cart/CartSummary";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


export default function CartPage() {
  return (
    <div className="w-full py-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <h1 className="text-2xl font-bold">Your Cart</h1>
          </CardHeader>
          <CardContent>
            <CartList />
          </CardContent>
        </Card>
        <div className="w-full">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
