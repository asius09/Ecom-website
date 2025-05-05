export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  review: number;
  image_url: string;
  created_at: string;
  updated_at?: string;
  category?: string;
  stock_quantity: number;
}
