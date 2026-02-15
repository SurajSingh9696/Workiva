"use server";

import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import SavedJob from "@/models/SavedJob";
import Applicant from "@/models/Applicant";
import User from "@/models/User";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { handleServerError, ErrorMessages } from "@/lib/error-handler";

export async function applyToJobAction(jobId: string, coverLetter?: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "applicant") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: "ERROR" as const, message: "Invalid job ID" };
    }

    // Get or create applicant profile
    let applicant = await Applicant.findOne({ 
      userId: new mongoose.Types.ObjectId(user.id) 
    });

    console.log("[APPLY] User ID:", user.id);
    console.log("[APPLY] Applicant found:", applicant?._id.toString());

    if (!applicant) {
      // Create applicant profile if it doesn't exist
      applicant = await Applicant.create({
        userId: new mongoose.Types.ObjectId(user.id),
      });
      console.log("[APPLY] Created new applicant:", applicant._id.toString());
    }

    // Check if already applied
    const existing = await Application.findOne({
      applicantId: applicant._id,
      jobId: new mongoose.Types.ObjectId(jobId),
    });

    if (existing) {
      return { status: "ERROR" as const, message: "You have already applied to this job" };
    }

    // Create application
    const newApplication = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      applicantId: applicant._id,
      coverLetter,
      status: "pending",
    });

    console.log("[APPLY] Application created:", {
      applicationId: newApplication._id.toString(),
      jobId: jobId,
      applicantId: applicant._id.toString(),
    });

    // Revalidate both applicant and employer views
    revalidatePath("/dashboard/applications");
    revalidatePath(`/dashboard/jobs/${jobId}`);
    revalidatePath(`/employer-dashboard/jobs/${jobId}/applicants`);

    return { status: "SUCCESS" as const, message: "Application submitted successfully!" };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function toggleSaveJobAction(jobId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "applicant") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: "ERROR" as const, message: "Invalid job ID" };
    }

    // Get or create applicant profile
    let applicant = await Applicant.findOne({ 
      userId: new mongoose.Types.ObjectId(user.id) 
    });

    if (!applicant) {
      // Create applicant profile if it doesn't exist
      applicant = await Applicant.create({
        userId: new mongoose.Types.ObjectId(user.id),
      });
    }

    // Check if already saved
    const existing = await SavedJob.findOne({
      applicantId: applicant._id,
      jobId: new mongoose.Types.ObjectId(jobId),
    });

    if (existing) {
      // Remove from saved
      await SavedJob.deleteOne({
        applicantId: applicant._id,
        jobId: new mongoose.Types.ObjectId(jobId),
      });

      revalidatePath("/dashboard/saved-jobs");
      revalidatePath(`/dashboard/jobs/${jobId}`);

      return { status: "SUCCESS" as const, message: "Job removed from saved", isSaved: false };
    } else {
      // Add to saved
      await SavedJob.create({
        jobId: new mongoose.Types.ObjectId(jobId),
        applicantId: applicant._id,
      });

      revalidatePath("/dashboard/saved-jobs");
      revalidatePath(`/dashboard/jobs/${jobId}`);

      return { status: "SUCCESS" as const, message: "Job saved successfully!", isSaved: true };
    }
  } catch (error) {
    return handleServerError(error);
  }
}

export async function updateApplicantProfileAction(data: any) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "applicant") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    const { phoneNumber, name, ...applicantData } = data;

    // Update or create applicant profile
    await Applicant.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(user.id) },
      applicantData,
      { upsert: true, new: true }
    );

    // Update user fields if provided
    const userUpdates: any = {};
    if (phoneNumber !== undefined) {
      userUpdates.phoneNumber = phoneNumber;
    }
    if (name !== undefined && name.trim()) {
      userUpdates.name = name;
    }
    
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(user.id, userUpdates);
    }

    revalidatePath("/dashboard/settings");

    return { status: "SUCCESS" as const, message: "Profile updated successfully!" };
  } catch (error) {
    return handleServerError(error);
  }
}
