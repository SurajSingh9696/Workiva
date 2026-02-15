import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerSidebar from "@/features/employers/components/employer-sidebar";
import { redirect } from "next/navigation";
import React from "react";
import BlockedAccountPage from "@/components/blocked-account-page";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  if (user.role !== "employer") return redirect("/dashboard");

  // Check if account is blocked/deleted
  if (user.deletedAt) {
    return <BlockedAccountPage />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <EmployerSidebar user={{ name: user.name, avatarUrl: user.avatarUrl }} />
      <main className="flex-1 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
