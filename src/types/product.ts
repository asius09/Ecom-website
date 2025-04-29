export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  review: number;
  image_url: string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  stock_quantity: number;
}
