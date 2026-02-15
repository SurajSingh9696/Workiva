import { getAllJobsAdmin } from "@/features/admin/server/admin.queries";
import { JobsTable } from "@/features/admin/components/jobs-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Briefcase } from "lucide-react";

// Disable caching to ensure real-time updates
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface JobsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  try {
    const params = await searchParams;
    const page = Number(params.page) || 1;

    const result = await getAllJobsAdmin(page, 20);

    return (
      <div className="space-y-6">
        <PageHeader
          icon={Briefcase}
          title="Job Management"
          description="View and manage all job postings"
        />

        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <JobsTable jobs={result.jobs} total={result.total} />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Jobs page error:", error);
    redirect("/login");
  }
}
