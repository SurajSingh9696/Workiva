import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getAllEmployerApplications } from "@/features/employers/server/employer.queries";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Download, FileText } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusUpdater } from "@/features/employers/components/application-status-updater";
import { DeleteApplicationButton } from "@/features/employers/components/delete-application-button";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmployerApplicationsPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "employer") {
    redirect("/login");
  }

  const applications = await getAllEmployerApplications();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    reviewing: "bg-blue-100 text-blue-800 border-blue-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <PageHeader
        icon={FileText}
        title="All Applications"
        description={`${applications.length} total application${applications.length !== 1 ? "s" : ""} across all jobs`}
      />

      {applications.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <User className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No applications yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            When candidates apply to your jobs, they'll appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow w-full">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                {/* Left side: Name, Email, Job */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold truncate">
                      {application.applicantName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.applicantEmail}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Applied for: </span>
                    <Link 
                      href={`/employer-dashboard/jobs/${application.jobId}/applicants`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {application.jobTitle}
                    </Link>
                  </div>
                </div>

                {/* Right side: Resume, Status, Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                  {/* Resume Download */}
                  {application.resumeUrl && (
                    <a 
                      href={application.resumeUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Resume
                      </Button>
                    </a>
                  )}

                  {/* Status Badge */}
                  <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                    {application.status}
                  </Badge>

                  {/* Status Updater */}
                  <div className="flex gap-2">
                    <ApplicationStatusUpdater
                      applicationId={application.id}
                      currentStatus={application.status}
                    />
                    {application.status === "rejected" && (
                      <DeleteApplicationButton applicationId={application.id} />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
