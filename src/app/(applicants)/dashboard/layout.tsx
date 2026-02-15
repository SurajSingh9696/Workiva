import ApplicantDashboardWrapper from "@/components/applicant-dashboard-wrapper";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
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

  if (user.role !== "applicant") return redirect("/employer-dashboard");

  // Check if account is blocked/deleted
  if (user.deletedAt) {
    return <BlockedAccountPage />;
  }

  return (
    <ApplicantDashboardWrapper user={{ name: user.name, avatarUrl: user.avatarUrl }}>
      {children}
    </ApplicantDashboardWrapper>
  );
}
