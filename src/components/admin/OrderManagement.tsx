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

interface Order {
  id: string;
  customer: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  date: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    customer: "Alice Johnson",
    status: "pending",
    total: 120,
    date: "2023-10-01",
  },
  {
    id: "2",
    customer: "Bob Smith",
    status: "processing",
    total: 89,
    date: "2023-10-02",
  },
  {
    id: "3",
    customer: "Charlie Brown",
    status: "shipped",
    total: 45,
    date: "2023-10-03",
  },
  {
    id: "4",
    customer: "David Wilson",
    status: "delivered",
    total: 230,
    date: "2023-10-04",
  },
  {
    id: "5",
    customer: "Eve Davis",
    status: "cancelled",
    total: 75,
    date: "2023-10-05",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge variant="default">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 text-white">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
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
