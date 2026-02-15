import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getJobApplications } from "@/features/employers/server/employer.queries";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { FileText, Mail, Phone, Calendar, User, ExternalLink, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusUpdater } from "@/features/employers/components/application-status-updater";
import { DeleteApplicationButton } from "@/features/employers/components/delete-application-button";
import { PageHeader } from "@/components/page-header";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface JobApplicantsPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function JobApplicantsPage({ params }: JobApplicantsPageProps) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "employer") {
    redirect("/login");
  }

  const { jobId } = await params;
  if (!jobId) return notFound();

  const applications = await getJobApplications(jobId, user.id.toString());

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    reviewing: "bg-blue-100 text-blue-800 border-blue-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <PageHeader
        icon={Users}
        title="Job Applications"
        description={
          applications.length > 0
            ? `${applications.length} application${applications.length !== 1 ? "s" : ""} for "${applications[0].jobTitle}"`
            : "View and manage applications for this job"
        }
      />

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6">
            When candidates apply to this job, they'll appear here
          </p>
          <Link href="/employer-dashboard/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{application.applicantName}</h3>
                      <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                        {application.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {application.applicantEmail}
                      </span>
                      {application.applicantPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {application.applicantPhone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Cover Letter
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {application.applicantBio && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Biography</p>
                    <p className="text-sm text-muted-foreground">
                      {application.applicantBio}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <ApplicationStatusUpdater
                    applicationId={application.id}
                    currentStatus={application.status}
                  />
                  {application.status === "rejected" && (
                    <DeleteApplicationButton applicationId={application.id} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
