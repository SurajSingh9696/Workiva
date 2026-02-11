import { db } from "@/config/db";
import { applications, jobs, employers, users } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function getApplicantApplications(userId: number) {
  const applicantApplications = await db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      status: applications.status,
      coverLetter: applications.coverLetter,
      resumeUrl: applications.resumeUrl,
      appliedAt: applications.createdAt,
      jobTitle: jobs.title,
      location: jobs.location,
      companyName: employers.name,
      companyLogo: employers.bannerImageUrl,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(eq(applications.applicantId, userId))
    .orderBy(desc(applications.createdAt));

  return applicantApplications;
}

export async function checkIfApplied(userId: number, jobId: number) {
  const application = await db
    .select()
    .from(applications)
    .where(eq(applications.applicantId, userId))
    .where(eq(applications.jobId, jobId))
    .limit(1);

  return application.length > 0;
}
