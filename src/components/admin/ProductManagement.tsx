"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductComposer } from "./ProductComposer";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "in stock" | "low stock" | "out of stock";
  performance: "high" | "medium" | "low";
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999,
    stock: 50,
    status: "in stock",
    performance: "high",
  },
  {
    id: "2",
    name: "MacBook Air M2",
    price: 1199,
    stock: 10,
    status: "low stock",
    performance: "medium",
  },
  {
    id: "3",
    name: "AirPods Pro",
    price: 249,
    stock: 0,
    status: "out of stock",
    performance: "low",
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in stock":
        return <Badge className="bg-green-500 text-white">In Stock</Badge>;
      case "low stock":
        return <Badge className="bg-yellow-500 text-white">Low Stock</Badge>;
      case "out of stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "high":
        return <Badge className="bg-green-500 text-white">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "low":
        return <Badge variant="destructive">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ProductComposer />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    {getPerformanceBadge(product.performance)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
