export type WishlistItem = {
    id: string;
    user_id: string;
    product_id: string;
    product: {
      name: string;
      slug: string;
      previewImage?: string;
    };
    created_at: string;
  };
  