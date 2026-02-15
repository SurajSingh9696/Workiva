import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, ArrowRight, LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";
import { getApplicantApplications } from "@/features/applicants/server/applications.queries";
import { getSavedJobs } from "@/features/applicants/server/saved-jobs.queries";
import { getAllJobs } from "@/features/employers/jobs/server/jobs.queries";
import { PageHeader } from "@/components/page-header";
import { ApplicantStatsCards } from "@/features/applicants/components/applicant-stats-cards";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ApplicantDashboard = async () => {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  // Fetch dashboard data
  const [applications, savedJobs, recentJobs] = await Promise.all([
    getApplicantApplications(user.id),
    getSavedJobs(user.id),
    getAllJobs({}, 6), // Get 6 recent jobs
  ]);

  const interviewInvitesCount = applications.filter((a) => a.status === "accepted").length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        icon={LayoutDashboard}
        title={`Welcome back, ${user.name}`}
        description="Track your applications and discover new opportunities"
      />

      {/* Stats Cards */}
      <ApplicantStatsCards
        applicationsCount={applications.length}
        savedJobsCount={savedJobs.length}
        interviewInvitesCount={interviewInvitesCount}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Link href="/dashboard/jobs">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <Search className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Browse Jobs</div>
                <div className="text-xs text-muted-foreground">
                  Discover new opportunities
                </div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <FileText className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Update Profile</div>
                <div className="text-xs text-muted-foreground">
                  Keep your information current
                </div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Link href="/dashboard/applications">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No applications yet. Start applying to jobs!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <Link
                  key={app.id}
                  href={`/dashboard/jobs/${app.jobId}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{app.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.companyName}
                    </p>
                  </div>
                  <div className="text-sm capitalize px-3 py-1 rounded-full bg-gray-100">
                    {app.status}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recommended for You</CardTitle>
          <Link href="/dashboard/jobs">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recentJobs.slice(0, 4).map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="flex gap-3 p-4 rounded-lg border hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <p className="font-semibold line-clamp-1">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.companyName}
                  </p>
                  <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{job.location || "Remote"}</span>
                    <span>•</span>
                    <span className="capitalize">{job.workType}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantDashboard;
