"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
  role: "Applicant" | "Employer" | "Admin";
}

export function MobileHeader({ onMenuClick, role }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-md hover:bg-accent transition-colors"
        title="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo and Project Name */}
      <div className="flex items-center gap-3 flex-1 justify-center mr-10">
        <img 
          src="/logo.png" 
          alt="Workiva Logo" 
          className="h-6 w-auto object-contain" 
        />
        <div className="text-center">
          <h1 className="text-lg font-bold">Workiva</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {role}
          </p>
        </div>
      </div>
    </header>
  );
}