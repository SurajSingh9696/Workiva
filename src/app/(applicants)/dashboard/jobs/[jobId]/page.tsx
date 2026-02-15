import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, Building2, Globe } from "lucide-react";

import { getJobById } from "@/features/employers/jobs/server/jobs.queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobOverviewSidebar from "@/features/applicants/jobs/components/jobOverviewSidebar";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { checkIfApplied } from "@/features/applicants/server/applications.queries";
import { checkIfSaved } from "@/features/applicants/server/saved-jobs.queries";
import { JobActions } from "@/features/applicants/jobs/components/job-actions";
import Link from "next/link";

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}

const JobsDetailedPage = async ({ params }: EditJobPageProps) => {
  // 1. Validate & Fetch
  const { jobId } = await params;

  const job = await getJobById(jobId);
  console.log("job: ", job);

  if (!job) return notFound();

  // Check if user has applied or saved
  const user = await getCurrentUser();
  let hasApplied = false;
  let isSaved = false;

  if (user && user.role === "applicant") {
    hasApplied = await checkIfApplied(user.id, jobId);
    isSaved = await checkIfSaved(user.id, jobId);
  }

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 space-y-8">
      {/* --- BANNER IMAGE --- */}
      {job.companyBanner && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl border shadow-sm">
          <Image
            src={job.companyBanner}
            alt={`${job.companyName} banner`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      {/* --- HERO HEADER --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b pb-8">
        <div className="flex gap-5">
          {/* Logo */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-50">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName || "Company"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-lg font-bold text-gray-400">
                {job.companyName?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Title & Meta */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-blue-600 flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.companyName}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location || "Remote"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Posted{" "}
                {formatDistanceToNow(new Date(job.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {user && user.role === "applicant" && (
          <JobActions jobId={jobId} hasApplied={hasApplied} isSaved={isSaved} />
        )}
      </div>

      {/* --- MAIN GRID CONTENT --- */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Description (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">
              About the Job
            </h2>
            <div
              className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
            {/* <p> {job.description} </p> */}
          </section>

          {/* Tags */}
          {job.tags && (
            <section className="pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.split(",").map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Company Info - Visible on large screens, below job description */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="text-base">About the Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p
                className="text-sm text-gray-600 prose prose-sm"
                dangerouslySetInnerHTML={{
                  __html: job.companyBio || "No company description available.",
                }}
              />

              {job.companyWebsite && (
                <Link
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit company website (opens in new tab)"
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Sidebar (1/3) */}

        <JobOverviewSidebar job={job} />
      </div>
    </div>
  );
};

export default JobsDetailedPage;
