import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getApplicantApplications } from "@/features/applicants/server/applications.queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin, Building2, Calendar, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const applications = await getApplicantApplications(user.id);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    reviewing: "bg-blue-100 text-blue-800 border-blue-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        icon={FileText}
        title="My Applications"
        description="Track all your job applications in one place"
      />

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6">
            Start applying to jobs to see them here
          </p>
          <Link href="/dashboard/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <Link href={`/dashboard/jobs/${application.jobId}`}>
                        <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                          {application.jobTitle}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {application.companyName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.location || "Remote"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                      {application.status}
                    </Badge>
                  </div>

                  {application.coverLetter && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Cover Letter:</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t">
                <Link href={`/dashboard/jobs/${application.jobId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
