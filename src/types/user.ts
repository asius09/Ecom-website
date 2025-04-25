export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price: number;
  in_stock: boolean;
  created_at: string;
}