import { JobForm } from "@/features/employers/components/employer-job-form";
import { getJobByIdAction } from "@/features/server/jobs.actions";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Edit } from "lucide-react";

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { jobId } = await params;

  // 1. Fetch Data
  const result = await getJobByIdAction(jobId);
  console.log("Job Data after ID: ", result);

  // 2. Handle Errors (e.g., user manually types a random ID)
  if (result.status === "ERROR" || !('data' in result) || !result.data) {
    redirect("/employer-dashboard/jobs");
  }

  const job = result.data;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <PageHeader
        icon={Edit}
        title={`Edit Job: ${job.title}`}
        description="Update your job posting details"
      />

      {/* 3. Pass the fetched data to the form */}
      <JobForm initialData={job} isEditMode={true} />
    </div>
  );
}
