"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function deleteUserAction(userId: string) {
  try {
    await requireAdmin();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { status: "ERROR" as const, message: "Invalid user ID" };
    }

    // Check if user is admin
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return { status: "ERROR" as const, message: "User not found" };
    }
    
    if (userToDelete.role === "admin") {
      return { status: "ERROR" as const, message: "Cannot delete admin users" };
    }

    // Soft delete
    await User.findByIdAndUpdate(userId, {
      deletedAt: new Date(),
    });

    revalidatePath("/admin/users");
    return { status: "SUCCESS" as const, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { status: "ERROR" as const, message: "Failed to delete user" };
  }
}

export async function toggleUserStatusAction(userId: string) {
  try {
    await requireAdmin();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { status: "ERROR" as const, message: "Invalid user ID" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { status: "ERROR" as const, message: "User not found" };
    }

    if (user.role === "admin") {
      return { status: "ERROR" as const, message: "Cannot suspend admin users" };
    }

    // Toggle deleted status
    if (user.deletedAt) {
      user.deletedAt = undefined;
    } else {
      user.deletedAt = new Date();
    }
    await user.save();

    revalidatePath("/admin/users");
    return {
      status: "SUCCESS" as const,
      message: user.deletedAt ? "User suspended" : "User activated",
    };
  } catch (error) {
    console.error("Error toggling user status:", error);
    return { status: "ERROR" as const, message: "Failed to update user status" };
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    await requireAdmin();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: "ERROR" as const, message: "Invalid job ID" };
    }

    const Job = (await import("@/models/Job")).default;
    const Application = (await import("@/models/Application")).default;
    const SavedJob = (await import("@/models/SavedJob")).default;
    
    // Delete all related applications
    await Application.deleteMany({ jobId: new mongoose.Types.ObjectId(jobId) });
    
    // Delete all saved job entries
    await SavedJob.deleteMany({ jobId: new mongoose.Types.ObjectId(jobId) });
    
    // Soft delete the job
    await Job.findByIdAndUpdate(jobId, {
      deletedAt: new Date(),
    });

    revalidatePath("/admin/jobs");
    revalidatePath("/dashboard/jobs");
    revalidatePath("/dashboard/saved-jobs");
    revalidatePath("/dashboard/applications");
    return { status: "SUCCESS" as const, message: "Job deleted successfully" };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { status: "ERROR" as const, message: "Failed to delete job" };
  }
}

export async function deleteApplicationAction(applicationId: string) {
  try {
    await requireAdmin();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return { status: "ERROR" as const, message: "Invalid application ID" };
    }

    const Application = (await import("@/models/Application")).default;
    
    // Permanently delete application
    await Application.findByIdAndDelete(applicationId);

    revalidatePath("/admin/applications");
    revalidatePath("/employer-dashboard");
    return { status: "SUCCESS" as const, message: "Application deleted successfully" };
  } catch (error) {
    console.error("Error deleting application:", error);
    return { status: "ERROR" as const, message: "Failed to delete application" };
  }
}

export async function hardDeleteUserAction(userId: string) {
  try {
    await requireAdmin();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { status: "ERROR" as const, message: "Invalid user ID" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { status: "ERROR" as const, message: "User not found" };
    }

    if (user.role === "admin") {
      return { status: "ERROR" as const, message: "Cannot permanently delete admin users" };
    }

    // Delete related records
    const Applicant = (await import("@/models/Applicant")).default;
    const Employer = (await import("@/models/Employer")).default;
    const Application = (await import("@/models/Application")).default;
    const Job = (await import("@/models/Job")).default;

    if (user.role === "applicant") {
      // Delete applicant profile and applications
      await Applicant.findOneAndDelete({ userId: user._id });
      await Application.deleteMany({ applicantId: user._id });
    } else if (user.role === "employer") {
      // Delete employer profile, jobs, and related applications
      const employer = await Employer.findOne({ userId: user._id });
      if (employer) {
        await Job.deleteMany({ employerId: employer._id });
        await Application.deleteMany({ employerId: employer._id });
        await Employer.findByIdAndDelete(employer._id);
      }
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    revalidatePath("/admin/users");
    return { status: "SUCCESS" as const, message: "User permanently deleted" };
  } catch (error) {
    console.error("Error permanently deleting user:", error);
    return { status:  "ERROR" as const, message: "Failed to permanently delete user" };
  }
}
