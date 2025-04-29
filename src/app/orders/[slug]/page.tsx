"use client";
import { useParams } from "next/navigation";
import { Truck, CheckCircle, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Example order data
const exampleOrders = [
  {
    id: "1",
    status: "Shipped",
    date: "2023-10-15",
    total: 349.98,
    items: [
      {
        id: "1",
        name: "Wireless Headphones",
        price: 199.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=3199&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "2",
        name: "Smart Watch",
        price: 149.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
];

export default function OrderPage() {
  const { slug } = useParams();
  const order = exampleOrders.find((order) => order.id === slug);


  if (!order) {
    return (
      <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          We couldn't find the order you're looking for. Please check the order
          number and try again.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/orders">View All Orders</Link>
          </Button>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order #{order.id}</h1>

      <div className="bg-background p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          {order.status === "Shipped" ? (
            <Truck className="w-8 h-8 text-primary" />
          ) : order.status === "Delivered" ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <Clock className="w-8 h-8 text-yellow-500" />
          )}
          <div>
            <h2 className="text-lg font-semibold">Status: {order.status}</h2>
            <p className="text-sm text-muted-foreground">
              Order placed on {order.date}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-6">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-medium">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Total</h3>
            <p className="text-2xl font-bold text-primary">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
