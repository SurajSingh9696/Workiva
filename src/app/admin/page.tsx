import {
  getAdminDashboardStats,
  getUserGrowthData,
  getJobStatsByType,
  getApplicationStatusStats,
} from "@/features/admin/server/admin.queries";
import { AdminStatsCards } from "@/features/admin/components/admin-stats-cards";
import { UserGrowthChart } from "@/features/admin/components/user-growth-chart";
import { JobStatsChart } from "@/features/admin/components/job-stats-chart";
import { ApplicationStatusChart } from "@/features/admin/components/application-status-chart";
import { RecentUsersTable } from "@/features/admin/components/recent-users-table";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { LayoutDashboard } from "lucide-react";

// Disable caching to ensure real-time updates
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  try {
    const [stats, userGrowth, jobStats, applicationStats] = await Promise.all([
      getAdminDashboardStats(),
      getUserGrowthData(),
      getJobStatsByType(),
      getApplicationStatusStats(),
    ]);

    if (!stats) {
      redirect("/login");
    }

    return (
      <div className="space-y-6">
        <PageHeader
          icon={LayoutDashboard}
          title="Admin Dashboard"
          description="Welcome to the Workiva Admin Panel"
        />

        {/* Stats Cards */}
        <AdminStatsCards stats={stats} />

        {/* Charts Grid */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <UserGrowthChart data={userGrowth} />
          <JobStatsChart data={jobStats} />
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <ApplicationStatusChart data={applicationStats} />
          <RecentUsersTable users={stats.recentUsers} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin dashboard error:", error);
    redirect("/login");
  }
}
