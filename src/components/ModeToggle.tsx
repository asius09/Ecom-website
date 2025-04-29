"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  label?: boolean;
}

export function ModeToggle({ label }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const getThemeLabel = () => {
    return theme === "light" ? "Light" : "Dark";
  };

  const getThemeIcon = () => {
    return theme === "light" ? (
      <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />
    ) : (
      <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent rendering anything theme-dependent until mounted
    return (
      <Button
        variant="outline"
        size="sm"
        className="hover:bg-accent/50 border-border rounded-sm px-2"
        aria-label="Toggle theme"
        role="button"
        disabled
      >
        {/* Maybe show a spinner or empty icon */}
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      size="sm"
      className={`hover:bg-accent/50 border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm ${
        label ? "px-4" : "px-2"
      }`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      role="button"
    >
      {getThemeIcon()}
      {label && (
        <span className="ml-2 text-sm font-medium text-foreground">
          {getThemeLabel()}
        </span>
      )}
    </Button>
  );
}
