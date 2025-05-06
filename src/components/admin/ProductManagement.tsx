"use client";

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
import { Product } from "@/types/product";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteProduct } from "@/utils/product/admin";
import { useAppDispatch } from "@/lib/hooks";

interface ProductManagementProps {
  products: Product[];
}

export function ProductManagement({ products }: ProductManagementProps) {
  const dispatch = useAppDispatch();
  const getStockStatus = (quantity: number) => {
    if (quantity > 10) return "In Stock";
    if (quantity > 0) return "Low Stock";
    return "Out of Stock";
  };

  const getPerformance = (price: number) => {
    if (price > 1000) return "High";
    if (price > 500) return "Medium";
    return "Low";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-500 text-white">In Stock</Badge>;
      case "Low Stock":
        return <Badge className="bg-yellow-500 text-white">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "High":
        return <Badge className="bg-green-500 text-white">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "Low":
        return <Badge variant="destructive">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product, dispatch);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting product:", error.message);
      } else {
        console.error("An unknown error occurred while deleting the product");
      }
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
                <TableHead>Image</TableHead>
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
                  <TableCell>
                    <div className="relative h-15 w-15">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    {getStatusBadge(getStockStatus(product.stock_quantity))}
                  </TableCell>
                  <TableCell>
                    {getPerformanceBadge(getPerformance(product.price))}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ProductComposer
                        product={product}
                        buttonText={
                          <>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </>
                        }
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1 cursor-pointer"
                        onClick={async () => await handleDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
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
