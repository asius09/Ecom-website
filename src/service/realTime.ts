// services/cartRealtime.ts
import { supabase } from "@/utils/supabase/client";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/store/slices/cartSlice";

export const setupCartRealtime = (userId: string, dispatch: any) => {
  const channel = supabase
    .channel("cart_realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        switch (payload.eventType) {
          case "INSERT":
            dispatch(
              addToCart({
                id: payload.new.id,
                product_id: payload.new.product_id,
                user_id: payload.new.user_id,
                quantity: payload.new.quantity,
              })
            );
            break;

          case "UPDATE":
            dispatch(
              updateQuantity({
                id: payload.new.id,
                quantity: payload.new.quantity,
              })
            );
            break;

          case "DELETE":
            dispatch(removeFromCart(payload.old.id));
            break;
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
