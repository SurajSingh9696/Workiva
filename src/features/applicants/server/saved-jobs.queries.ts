import { db } from "@/config/db";
import { savedJobs, jobs, employers } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function getSavedJobs(userId: number) {
  const saved = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      location: jobs.location,
      workType: jobs.workType,
      jobType: jobs.jobType,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      createdAt: jobs.createdAt,
      companyName: employers.name,
      companyLogo: employers.bannerImageUrl,
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(eq(savedJobs.applicantId, userId))
    .orderBy(desc(savedJobs.createdAt));

  return saved;
}

export async function checkIfSaved(userId: number, jobId: number) {
  const saved = await db
    .select()
    .from(savedJobs)
    .where(eq(savedJobs.applicantId, userId))
    .where(eq(savedJobs.jobId, jobId))
    .limit(1);

  return saved.length > 0;
}
