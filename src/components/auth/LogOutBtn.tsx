"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearCart } from "@/lib/store/features/cartSlice";
import { clearUser } from "@/lib/store/features/userSlice";
import { clearWishlist } from "@/lib/store/features/wishlistSlice";
import { useAppDispatch } from "@/lib/hooks";
import { supabase } from "@/utils/supabase/client";

interface LogOutBtnProps {
  variant?: "text" | "button";
}

export function LogOutBtn({ variant = "button" }: LogOutBtnProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        dispatch(clearCart());
        dispatch(clearUser());
        dispatch(clearWishlist());
        if (typeof window !== "undefined") {
          localStorage.removeItem("persist:root");
        }
        router.push("/login");
        router.refresh();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (variant === "text") {
    return (
      <button
        onClick={handleLogout}
        className="text-red-500 hover:text-red-600 font-medium text-sm cursor-pointer"
        aria-label="Log out"
      >
        Log Out
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-500 hover:text-red-600 hover:bg-accent/50 border-border rounded-sm px-2 cursor-pointer"
      onClick={handleLogout}
      aria-label="Log out"
    >
      Log Out
    </Button>
  );
}
