export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  reviews: number;
  image_url: string;
  createdAt?: string;
  updatedAt?: string;
}
