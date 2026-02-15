import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { EmployerProfileCompletionStatus } from "@/features/employers/components/employer-profile-status";
import { StatsCards } from "@/features/employers/components/employer-stats";
import { getEmployerStats, getRecentApplications } from "@/features/employers/server/employer-stats.queries";
import { RecentApplications } from "@/features/employers/components/recent-applications";
import { QuickActions } from "@/features/employers/components/quick-actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Eye, ArrowRight, Users, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { getEmployerJobsAction } from "@/features/server/jobs.actions";
import { PageHeader } from "@/components/page-header";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EmployerDashboard = async () => {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  // Fetch employer's jobs, stats, and applications
  const [jobsResult, stats, applications] = await Promise.all([
    getEmployerJobsAction(),
    getEmployerStats(),
    getRecentApplications()
  ]);
  
  const recentJobs = jobsResult.status === "SUCCESS" && jobsResult.data 
    ? jobsResult.data.slice(0, 5) 
    : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <PageHeader
          icon={LayoutDashboard}
          title={`Welcome back, ${user?.name}`}
          description="Manage your job postings and track applications"
          className="flex-1"
        />
        <Link href="/employer-dashboard/jobs/create" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Profile Completion */}
      <EmployerProfileCompletionStatus />

      {/* Quick Actions */}
      <QuickActions />

      {/* Two Column Layout for Recent Jobs and Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Applicatiapplications={applications} ons */}
        <RecentApplications />

        {/* Recent Jobs */}
        <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl">Recent Job Postings</CardTitle>
          <Link href="/employer-dashboard/jobs">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Start by creating your first job posting
              </p>
              <Link href="/employer-dashboard/jobs/create">
                <Button className="w-full sm:w-auto">
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors gap-3 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{job.title}</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span className="capitalize">{job.jobType}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="capitalize">{job.workType}</span>
                      {job.location && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="truncate max-w-[150px]">{job.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/employer-dashboard/jobs/${job.id}/applicants`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Users className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Applicants</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </Link>
                    <Link href={`/employer-dashboard/jobs/${job.id}/edit`} className="flex-1 sm:flex-none">
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
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
    </div>
  );
};

export default EmployerDashboard;
