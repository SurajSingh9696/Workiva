import { db } from "@/config/db";
import { applications, jobs, applicants, users } from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getJobApplications(jobId: number, employerId: number) {
  // First verify the job belongs to this employer
  const job = await db
    .select()
    .from(jobs)
    .where(and(
      eq(jobs.id, jobId),
      eq(jobs.employerId, employerId)
    ))
    .limit(1);

  if (job.length === 0) {
    return [];
  }

  const jobApplications = await db
    .select({
      id: applications.id,
      status: applications.status,
      coverLetter: applications.coverLetter,
      resumeUrl: applications.resumeUrl,
      appliedAt: applications.createdAt,
      jobTitle: jobs.title,
      applicantName: users.name,
      applicantEmail: users.email,
      applicantPhone: users.phoneNumber,
      applicantBio: applicants.biography,
      applicantLocation: applicants.location,
      applicantEducation: applicants.education,
      applicantExperience: applicants.experience,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(applicants, eq(applications.applicantId, applicants.id))
    .innerJoin(users, eq(applicants.id, users.id))
    .where(eq(applications.jobId, jobId))
    .orderBy(desc(applications.createdAt));

  return jobApplications;
}

export async function getEmployerStats(employerId: number) {
  const [jobCount] = await db
    .select({ count: db.$count() })
    .from(jobs)
    .where(eq(jobs.employerId, employerId));

  const jobIds = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(eq(jobs.employerId, employerId));

  if (jobIds.length === 0) {
    return {
      totalJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
    };
  }

  const jobIdList = jobIds.map(j => j.id);

  const [appCount] = await db
    .select({ count: db.$count() })
    .from(applications)
    .where(eq(applications.jobId, jobIdList[0])); // Simplified for now

  return {
    totalJobs: jobCount.count,
    totalApplications: appCount.count,
    pendingApplications: 0,
  };
}
