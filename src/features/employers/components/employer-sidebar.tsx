"use client";

import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { isActiveLink } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";
import { LogOut, Briefcase, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { employerNavItems } from "@/config/constant";
import { useState, useEffect } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface EmployerSidebarProps {
  user: {
    name: string;
    avatarUrl?: string | null;
  };
  isOverlayOpen?: boolean;
  onOverlayToggle?: () => void;
}

const EmployerSidebar = ({ user, isOverlayOpen: externalOverlayOpen, onOverlayToggle }: EmployerSidebarProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [internalOverlayOpen, setInternalOverlayOpen] = useState(false);
  
  // Use external overlay state if provided, otherwise use internal
  const isOverlayOpen = externalOverlayOpen ?? internalOverlayOpen;
  const setIsOverlayOpen = onOverlayToggle ? () => onOverlayToggle() : setInternalOverlayOpen;

  // Set initial state based on screen size once on mount
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const smallScreen = width <= 768;
      setIsSmallScreen(smallScreen);
      
      if (smallScreen) {
        // On small screens, hide sidebar and use overlay
        setIsExpanded(false);
        if (!externalOverlayOpen) {
          setInternalOverlayOpen(false);
        }
      } else {
        // On larger screens, show sidebar normally
        setIsExpanded(width >= 1024);
      }
    };

    // Set initial state
    handleResize();
    setMounted(true);
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [externalOverlayOpen]);

  // Close overlay when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!onOverlayToggle) {
          setInternalOverlayOpen(false);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('employer-sidebar');
      if (isOverlayOpen && sidebar && !sidebar.contains(e.target as Node)) {
        if (!onOverlayToggle) {
          setInternalOverlayOpen(false);
        }
      }
    };

    if (isOverlayOpen && !onOverlayToggle) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOverlayOpen, onOverlayToggle]);

  const toggleSidebar = () => {
    if (isSmallScreen) {
      setIsOverlayOpen();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleNavClick = () => {
    // Close overlay when navigation item is clicked on small screens
    if (isSmallScreen) {
      setIsOverlayOpen();
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Backdrop for overlay */}
      {isSmallScreen && isOverlayOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}

      {/* Sidebar */}
      <div
        id="employer-sidebar"
        className={cn(
          "bg-card border-r border-border h-full transition-all duration-300 ease-in-out flex flex-col shrink-0",
          // On small screens: fixed positioning for overlay
          isSmallScreen ? (
            isOverlayOpen 
              ? "fixed left-0 top-0 z-50 w-64 shadow-2xl" 
              : "hidden"
          ) : (
            // On larger screens: normal sidebar behavior
            isExpanded ? "w-48 sm:w-56 lg:w-64" : "w-16"
          )
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center gap-2 border-b border-border px-2">
          {/* Close button for mobile overlay */}
          {isSmallScreen && isOverlayOpen && (
            <button
              onClick={() => setIsOverlayOpen()}
              className="absolute right-4 top-4 p-1 rounded-md hover:bg-accent"
              title="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <img 
            src="/logo.png" 
            alt="Workiva Logo" 
            className="h-7 w-auto object-contain transition-all" 
          />
          {(isExpanded || (isSmallScreen && isOverlayOpen)) && (
            <div className={cn(isSmallScreen ? "block" : "hidden lg:block")}>
              <h1 className="text-base md:text-lg font-bold">Workiva</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Employer
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {employerNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(pathname, item.href, item.exact);

            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  // Center when collapsed (non-mobile), left-align when expanded or mobile overlay
                  !isExpanded && !isSmallScreen && "justify-center"
                )}
                title={(!isExpanded && !isSmallScreen) ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {(isExpanded || (isSmallScreen && isOverlayOpen)) && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="border-t border-border px-3 py-2">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2",
            !isExpanded && !isSmallScreen && "justify-center"
          )}>
            <UserAvatar 
              name={user.name} 
              avatarUrl={user.avatarUrl}
              className="flex-shrink-0 h-8 w-8"
            />
            {(isExpanded || (isSmallScreen && isOverlayOpen)) && (
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Employer</p>
                </div>
                <div className="ml-2">
                  <ThemeToggle />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle - Collapsed State (non-mobile only) */}
        {!isExpanded && !isSmallScreen && (
          <div className="px-3 py-1">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        )}

        {/* Toggle Button - Hidden on very small screens where expansion isn't allowed */}
        {!isSmallScreen && (
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
                  <span>Shrink</span>
                </>
              ) : (
                <PanelLeftOpen className="h-5 w-5 flex-shrink-0" />
              )}
            </button>
          </div>
        )}

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
            {isExpanded && <span>Log out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default EmployerSidebar;
