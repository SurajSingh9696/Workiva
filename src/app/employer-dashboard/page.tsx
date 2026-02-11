import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { EmployerProfileCompletionStatus } from "@/features/employers/components/employer-profile-status";
import { StatsCards } from "@/features/employers/components/employer-stats";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Eye, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { getEmployerJobsAction } from "@/features/server/jobs.actions";

const EmployerDashboard = async () => {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  // Fetch employer's jobs
  const jobsResult = await getEmployerJobsAction();
  const recentJobs = jobsResult.status === "SUCCESS" && jobsResult.data 
    ? jobsResult.data.slice(0, 5) 
    : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-blue-600">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your job postings and track applications
          </p>
        </div>
        <Link href="/employer-dashboard/jobs/create">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Profile Completion */}
      <EmployerProfileCompletionStatus />

      {/* Recent Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Job Postings</CardTitle>
          <Link href="/employer-dashboard/jobs">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first job posting
              </p>
              <Link href="/employer-dashboard/jobs/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{job.title}</h4>
                    <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="capitalize">{job.jobType}</span>
                      <span>•</span>
                      <span className="capitalize">{job.workType}</span>
                      {job.location && (
                        <>
                          <span>•</span>
                          <span>{job.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/employer-dashboard/jobs/${job.id}/applicants`}>
                      <Button variant="outline" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        Applicants
                      </Button>
                    </Link>
                    <Link href={`/employer-dashboard/jobs/${job.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDashboard;
