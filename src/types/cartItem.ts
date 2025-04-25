export type CartItem = {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    product: {
      name: string;
      price: number;
      previewImage?: string;
    };
    created_at: string;
  };
  