import { EmployerJobList } from "@/features/employers/components/employer-job-list";
import { PageHeader } from "@/components/page-header";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function JobsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        icon={Briefcase}
        title="My Job Posts"
        description="Manage all your job postings and track their performance"
      >
        <Link href="/employer-dashboard/jobs/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </PageHeader>
      <EmployerJobList />
    </div>
  );
}
