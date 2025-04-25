export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currencyCode: string;
    featuredAsset?: {
      preview: string;
    };
    assets?: {
      preview: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
  };
  