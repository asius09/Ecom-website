"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  label?: boolean;
}

export function ModeToggle({ label }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-foreground" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-foreground" />;
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] text-foreground" />;
    }
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={toggleTheme}
    >
      <Button 
        variant="outline" 
        size="sm" 
        className="hover:bg-accent/50 border-border"
      >
        {getThemeIcon()}
        <span className="sr-only">Toggle theme</span>
      </Button>
      {label && <span className="text-sm font-medium text-foreground">{getThemeLabel()}</span>}
    </div>
  );
}
