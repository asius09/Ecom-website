import { useAppSelector } from "@/lib/hooks";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export function CartSummary() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.products.products);

  const { subtotal, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);

    const shipping = 9.99;
    const calculatedTotal = calculatedSubtotal + shipping;

    return { subtotal: calculatedSubtotal, total: calculatedTotal };
  }, [cartItems, products]);

  return (
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
          <span>$9.99</span>
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
  );
}
