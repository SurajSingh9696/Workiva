import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerDashboardWrapper from "@/components/employer-dashboard-wrapper";
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
    <EmployerDashboardWrapper user={{ name: user.name, avatarUrl: user.avatarUrl }}>
      {children}
    </EmployerDashboardWrapper>
  );
}
