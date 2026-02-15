"use server";

import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { handleServerError, ErrorMessages } from "@/lib/error-handler";

export async function updateApplicationStatusAction(
  applicationId: string,
  status: string
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "employer") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return { status: "ERROR" as const, message: "Invalid application ID" };
    }

    // Validate status
    const validStatuses = ["pending", "reviewing", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return { status: "ERROR" as const, message: "Invalid status value" };
    }

    const result = await Application.findByIdAndUpdate(
      applicationId,
      { status: status as any },
      { new: true }
    ).populate('jobId');

    if (!result) {
      return { status: "ERROR" as const, message: "Application not found" };
    }

    // Revalidate all relevant paths for real-time updates
    revalidatePath("/employer-dashboard");
    revalidatePath("/employer-dashboard/jobs");
    revalidatePath("/employer-dashboard/applications");
    revalidatePath("/dashboard/applications"); // Applicant view
    
    // Revalidate specific job applicants page if we have the jobId
    if (result.jobId && typeof result.jobId === 'object' && '_id' in result.jobId) {
      revalidatePath(`/employer-dashboard/jobs/${result.jobId._id}/applicants`);
    }

    return { status: "SUCCESS" as const, message: "Application status updated successfully" };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function deleteApplicationAction(applicationId: string) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "employer") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return { status: "ERROR" as const, message: "Invalid application ID" };
    }

    const application = await Application.findById(applicationId).populate('jobId');

    if (!application) {
      return { status: "ERROR" as const, message: "Application not found" };
    }

    // Only allow deletion of rejected applications
    if (application.status !== "rejected") {
      return { status: "ERROR" as const, message: "Can only delete rejected applications" };
    }

    await Application.findByIdAndDelete(applicationId);

    // Revalidate all relevant paths
    revalidatePath("/employer-dashboard");
    revalidatePath("/employer-dashboard/jobs");
    revalidatePath("/employer-dashboard/applications");
    
    if (application.jobId && typeof application.jobId === 'object' && '_id' in application.jobId) {
      revalidatePath(`/employer-dashboard/jobs/${application.jobId._id}/applicants`);
    }

    return { status: "SUCCESS" as const, message: "Application deleted successfully" };
  } catch (error) {
    return handleServerError(error);
  }
}
