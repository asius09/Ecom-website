"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export  function AdminDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: "123",
      icon: <ShoppingCart className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Total Revenue",
      value: "$45,000",
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
    },
    {
      title: "New Customers",
      value: "89",
      icon: <Users className="w-5 h-5 text-purple-500" />,
    },
    {
      title: "Top Product",
      value: "iPhone 15 Pro",
      icon: <Package className="w-5 h-5 text-orange-500" />,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
