"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { updateUserThemeAction } from "@/features/auth/server/theme.actions";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Update theme immediately for instant feedback
    setTheme(newTheme);
    
    // Silently save to database without showing toasts
    try {
      await updateUserThemeAction(newTheme);
    } catch (error) {
      // Silent error handling - could log to console if needed
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative h-[1.2rem] w-[1.2rem]">
        <Sun
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}