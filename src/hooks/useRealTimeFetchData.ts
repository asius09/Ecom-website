"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/store/slices/userSlice";
import { setCartItems } from "@/lib/store/slices/cartSlice";
import { addToWishlist } from "@/lib/store/slices/wishlistSlice";
import { setProducts } from "@/lib/store/slices/productSlice";
import { supabase } from "@/utils/supabase/client";
import { createUser } from "../app/api/user/action";
import {
  fetchCartProducts,
  fetchWishlistProducts,
  getAllProducts,
} from "../app/api/products/users/action";

export const useRealTimeFetchData = () => {
  const dispatch = useAppDispatch();
  const cartChannelRef = useRef<any>(null);
  const wishlistChannelRef = useRef<any>(null);
  const productsChannelRef = useRef<any>(null);

  const setupRealtimeSubscriptions = async (user: any) => {
    // Products subscription
    productsChannelRef.current = supabase
      .channel("products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        async (payload) => {
          const updatedProducts = await getAllProducts();
          dispatch(setProducts(updatedProducts || []));
        }
      )
      .subscribe();

    // Cart subscription
    cartChannelRef.current = supabase
      .channel("cart")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const updatedCart = await fetchCartProducts(user.id);
          dispatch(setCartItems(updatedCart || []));
        }
      )
      .subscribe();

    // Wishlist subscription
    wishlistChannelRef.current = supabase
      .channel("wishlist")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist_items",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const updatedWishlist = await fetchWishlistProducts(user.id);
          dispatch(addToWishlist(updatedWishlist || []));
        }
      )
      .subscribe();
  };

  const cleanupSubscriptions = () => {
    if (productsChannelRef.current) {
      productsChannelRef.current.unsubscribe();
    }
    if (cartChannelRef.current) {
      cartChannelRef.current.unsubscribe();
    }
    if (wishlistChannelRef.current) {
      wishlistChannelRef.current.unsubscribe();
    }
  };

  const initializeUserData = async (user: any) => {
    const createdUser = await createUser({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || "",
      is_admin: false,
    });

    if (createdUser) {
      dispatch(
        setUser({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || "",
          is_admin: false,
          created_at: user.created_at,
        })
      );

      // Initial data fetch
      const [products, cartProducts, wishlistProducts] = await Promise.all([
        getAllProducts(),
        fetchCartProducts(user.id),
        fetchWishlistProducts(user.id),
      ]);

      dispatch(setProducts(products || []));
      dispatch(setCartItems(cartProducts || []));
      dispatch(addToWishlist(wishlistProducts || []));

      // Setup realtime subscriptions
      await setupRealtimeSubscriptions(user);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          await initializeUserData(user);
        } else {
          // Fetch products even if no user is logged in
          const products = await getAllProducts();
          dispatch(setProducts(products || []));
          await setupRealtimeSubscriptions(null);
        }

        return () => cleanupSubscriptions();
      } catch (error) {
        console.error(
          "Error:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    fetchData();
  }, [dispatch]);
};
