"use server";

import { db } from "@/config/db";
import { applications, savedJobs, applicants } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function applyToJobAction(jobId: number, coverLetter?: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "applicant") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    // Check if already applied
    const existing = await db
      .select()
      .from(applications)
      .where(and(
        eq(applications.applicantId, user.id),
        eq(applications.jobId, jobId)
      ))
      .limit(1);

    if (existing.length > 0) {
      return { status: "ERROR", message: "You have already applied to this job" };
    }

    // Create application
    await db.insert(applications).values({
      jobId,
      applicantId: user.id,
      coverLetter,
      status: "pending",
    });

    revalidatePath("/dashboard/applications");
    revalidatePath(`/dashboard/jobs/${jobId}`);

    return { status: "SUCCESS", message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Apply to job error:", error);
    return { status: "ERROR", message: "Failed to submit application" };
  }
}

export async function toggleSaveJobAction(jobId: number) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "applicant") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    // Check if already saved
    const existing = await db
      .select()
      .from(savedJobs)
      .where(and(
        eq(savedJobs.applicantId, user.id),
        eq(savedJobs.jobId, jobId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Remove from saved
      await db
        .delete(savedJobs)
        .where(and(
          eq(savedJobs.applicantId, user.id),
          eq(savedJobs.jobId, jobId)
        ));

      revalidatePath("/dashboard/saved-jobs");
      revalidatePath(`/dashboard/jobs/${jobId}`);

      return { status: "SUCCESS", message: "Job removed from saved", isSaved: false };
    } else {
      // Add to saved
      await db.insert(savedJobs).values({
        jobId,
        applicantId: user.id,
      });

      revalidatePath("/dashboard/saved-jobs");
      revalidatePath(`/dashboard/jobs/${jobId}`);

      return { status: "SUCCESS", message: "Job saved successfully!", isSaved: true };
    }
  } catch (error) {
    console.error("Toggle save job error:", error);
    return { status: "ERROR", message: "Failed to save job" };
  }
}

export async function updateApplicantProfileAction(data: any) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "applicant") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    // Check if profile exists
    const existing = await db
      .select()
      .from(applicants)
      .where(eq(applicants.id, user.id))
      .limit(1);

    if (existing.length === 0) {
      // Create new profile
      await db.insert(applicants).values({
        id: user.id,
        ...data,
      });
    } else {
      // Update existing profile
      await db
        .update(applicants)
        .set(data)
        .where(eq(applicants.id, user.id));
    }

    revalidatePath("/dashboard/settings");

    return { status: "SUCCESS", message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { status: "ERROR", message: "Failed to update profile" };
  }
}
