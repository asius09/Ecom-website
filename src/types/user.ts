export type User = {
    id: string;
    email: string;
    full_name?: string;
    role?: "user" | "admin";
    created_at: string;
  };
  