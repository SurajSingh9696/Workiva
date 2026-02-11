import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getSavedJobs } from "@/features/applicants/server/saved-jobs.queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/features/employers/jobs/components/jobCard";

export default async function SavedJobsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const savedJobs = await getSavedJobs(user.id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Jobs you've bookmarked for later
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bookmark className="h-5 w-5" />
          <span className="font-semibold">{savedJobs.length} saved</span>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <Card className="p-12 text-center">
          <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved jobs yet</h3>
          <p className="text-muted-foreground mb-6">
            Save jobs you're interested in to review them later
          </p>
          <Link href="/dashboard/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedJobs.map((savedJob) => (
            <JobCard key={savedJob.id} job={savedJob} />
          ))}
        </div>
      )}
    </div>
  );
}
