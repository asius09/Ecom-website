"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

interface ModeToggleProps {
  label?: boolean;
  className?: string;
}

export function ModeToggle({ label, className }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = theme as Theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  const themeLabel = currentTheme === "light" ? "Light" : "Dark";
  const ThemeIcon = currentTheme === "light" ? Sun : Moon;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "hover:bg-accent/50 border-border rounded-sm px-2",
          className
        )}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "hover:bg-accent/50 border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm",
        label ? "px-4" : "px-2",
        className
      )}
      onClick={toggleTheme}
      aria-label={`Toggle theme (currently ${themeLabel} mode)`}
    >
      <ThemeIcon className="h-[1.2rem] w-[1.2rem] text-foreground" />
      {label && (
        <span className="ml-2 text-sm font-medium text-foreground">
          {themeLabel}
        </span>
      )}
    </Button>
  );
}
