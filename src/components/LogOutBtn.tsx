"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signout } from "@/app/api/auth/action";

interface LogOutBtnProps {
  variant?: "text" | "button";
}

export function LogOutBtn({ variant = "button" }: LogOutBtnProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signout();
      toast.success("Logged out successfully");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
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
      className="hover:bg-accent/50 border-border rounded-sm px-2"
      onClick={handleLogout}
      aria-label="Log out"
    >
      Log Out
    </Button>
  );
}
