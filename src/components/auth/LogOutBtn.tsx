"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signout } from "@/app/api/auth/action";

interface LogOutBtnProps {
  variant?: "text" | "button";
}

export function LogOutBtn({ variant = "button" }: LogOutBtnProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const success = await signout();
      if (success) {
        router.refresh();
        router.push("/login");
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
        className="text-red-500 hover:text-red-600 font-medium text-sm"
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
      className="text-red-500 hover:text-red-600 hover:bg-accent/50 border-border rounded-sm px-2"
      onClick={handleLogout}
      aria-label="Log out"
    >
      Log Out
    </Button>
  );
}
