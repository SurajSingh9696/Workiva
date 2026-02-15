import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import AdminDashboardWrapper from "@/components/admin-dashboard-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <AdminDashboardWrapper user={{ name: user.name, avatarUrl: user.avatarUrl }}>
      {children}
    </AdminDashboardWrapper>
  );
}
