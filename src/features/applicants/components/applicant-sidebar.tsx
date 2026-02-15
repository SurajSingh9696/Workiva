"use client";

import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { isActiveLink } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";
import { LogOut, Briefcase, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { applicantNavItems } from "@/config/constant";
import { useState, useEffect } from "react";
import { UserAvatar } from "@/components/user-avatar";

interface ApplicantSidebarProps {
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

const ApplicantSidebar = ({ user }: ApplicantSidebarProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set initial state based on screen size once on mount
  useEffect(() => {
    setIsExpanded(window.innerWidth >= 1024);
    setMounted(true);
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Sidebar - Always visible, responsive width */}
      <div
        className={cn(
          "bg-card border-r border-border h-full transition-all duration-300 ease-in-out flex flex-col shrink-0",
          // All screens: User can toggle between w-16 (collapsed) and w-64 (expanded)
          // Default: collapsed on mobile, expanded on desktop
          isExpanded ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center gap-2 border-b border-border px-2">
          <img 
            src="/logo.png" 
            alt="Workiva Logo" 
            className="h-7 w-auto object-contain transition-all" 
          />
          {isExpanded && (
            <div className="hidden lg:block">
              <h1 className="text-base md:text-lg font-bold">Workiva</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Applicant
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {applicantNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(pathname, item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href || "#"}

                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  // Center when collapsed, left-align when expanded
                  !isExpanded && "justify-center"
                )}
                title={!isExpanded ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span className="truncate hidden lg:block">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="border-t border-border px-3 py-2">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2",
            !isExpanded && "justify-center"
          )}>
            <UserAvatar 
              name={user.name} 
              avatarUrl={user.avatarUrl}
              className="flex-shrink-0 h-8 w-8"
            />
            {isExpanded && (
              <div className="flex-1 min-w-0 hidden lg:block">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">Applicant</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - Now visible on all screen sizes */}
        <div className="border-t border-border px-3 py-1">
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full",
              !isExpanded && "justify-center"
            )}
            title={isExpanded ? "Shrink sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <>
                <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
                <span className="hidden lg:block">Shrink</span>
              </>
            ) : (
              <PanelLeftOpen className="h-5 w-5 flex-shrink-0" />
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="border-t border-border px-3 py-1">
          <button
            onClick={() => {
              logoutUserAction();
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 transition-colors w-full",
              !isExpanded && "justify-center"
            )}
            title={!isExpanded ? "Log out" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="hidden lg:block">Log out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default ApplicantSidebar;
