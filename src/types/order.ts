export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  price_at_purchase: number;
}
