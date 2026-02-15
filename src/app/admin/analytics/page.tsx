import {
  getApplicationTrends,
  getJobsByWorkType,
  getTopEmployers,
  getSuccessRateData,
} from "@/features/admin/server/admin.analytics";
import { ApplicationTrendsChart } from "@/features/admin/components/application-trends-chart";
import { JobStatsChart } from "@/features/admin/components/job-stats-chart";
import { TopEmployersChart } from "@/features/admin/components/top-employers-chart";
import { SuccessRateChart } from "@/features/admin/components/success-rate-chart";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { BarChart3 } from "lucide-react";

// Disable caching to ensure real-time updates
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnalyticsPage() {
  try {
    const [applicationTrends, workTypeStats, topEmployers, successRates] =
      await Promise.all([
        getApplicationTrends(),
        getJobsByWorkType(),
        getTopEmployers(),
        getSuccessRateData(),
      ]);

    return (
      <div className="space-y-6">
        <PageHeader
          icon={BarChart3}
          title="Analytics"
          description="Deep insights into platform performance and trends"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <ApplicationTrendsChart data={applicationTrends} />
          <JobStatsChart data={workTypeStats} />
          <TopEmployersChart data={topEmployers} />
          <SuccessRateChart data={successRates} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Analytics page error:", error);
    redirect("/login");
  }
}
