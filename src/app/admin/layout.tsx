import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

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
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar user={{ name: user.name, avatarUrl: user.avatarUrl }} />
      <main className="flex-1 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
