"use client";

import { useState } from "react";
import ApplicantSidebar from "@/features/applicants/components/applicant-sidebar";
import { MobileHeader } from "@/components/mobile-header";

interface ApplicantDashboardWrapperProps {
  user: {
    name: string;
    avatarUrl?: string | null;
  };
  children: React.ReactNode;
}

export default function ApplicantDashboardWrapper({ user, children }: ApplicantDashboardWrapperProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  return (
    <>
      {/* Mobile Header - Fixed at top on small screens */}
      <MobileHeader onMenuClick={toggleOverlay} role="Applicant" />
      
      <div className="flex h-screen bg-background overflow-hidden lg:pt-0 pt-16">
        {/* Sidebar */}
        <ApplicantSidebar 
          user={user} 
          isOverlayOpen={isOverlayOpen}
          onOverlayToggle={toggleOverlay}
        />
        
        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto">
          <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}