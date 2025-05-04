"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signout } from "@/app/api/auth/action";
import { clearCart } from "@/lib/store/slices/cartSlice";
import { clearUser } from "@/lib/store/slices/userSlice";
import { clearWishlist } from "@/lib/store/slices/wishlistSlice";
import { useAppDispatch } from "@/lib/hooks";

interface LogOutBtnProps {
  variant?: "text" | "button";
}

export function LogOutBtn({ variant = "button" }: LogOutBtnProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const success = await signout();
      if (success) {
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
