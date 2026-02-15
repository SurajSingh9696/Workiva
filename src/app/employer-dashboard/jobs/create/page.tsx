import { JobForm } from "@/features/employers/components/employer-job-form";
import { PageHeader } from "@/components/page-header";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Jobs = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Briefcase}
        title="Post a New Job"
        description="Fill in the details below to create a new job posting. Make it compelling to attract the best talent."
      />

      {/* Form */}
      <JobForm />
    </div>
  );
};

export default Jobs;
