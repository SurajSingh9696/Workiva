"use server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "../auth/server/auth.queries";
import Employer from "@/models/Employer";
import User from "@/models/User";
import { EmployerProfileData } from "../employers/employers.schema";
import mongoose from "mongoose";
import { handleServerError, ErrorMessages } from "@/lib/error-handler";
import { revalidatePath } from "next/cache";
import { transformForDb } from "@/lib/db-transformers";

export const updateEmployerProfileAction = async (
  data: EmployerProfileData
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    const {
      userName,
      name,
      description,
      yearOfEstablishment,
      location,
      websiteUrl,
      organizationType,
      teamSize,
      avatarUrl,
      bannerImageUrl,
    } = data;

    console.log("[UPDATE_PROFILE] Updating with data:", {
      userId: currentUser.id,
      userName,
      name,
      hasAvatarUrl: !!avatarUrl,
      avatarUrlLength: avatarUrl?.length,
      hasBannerUrl: !!bannerImageUrl,
      bannerUrlLength: bannerImageUrl?.length,
    });

    await connectDB();

    // Transform UI values to database values
    const transformedData = transformForDb({
      name,
      description,
      location,
      websiteUrl,
      organizationType,
      teamSize,
      bannerImageUrl,
      yearOfEstablishment: yearOfEstablishment
        ? parseInt(yearOfEstablishment)
        : null,
    });

    // Update employer profile
    const updatedEmployer = await Employer.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(currentUser.id) },
      transformedData,
      { upsert: true, new: true }
    );

    console.log("[UPDATE_PROFILE] Employer updated:", {
      employerId: updatedEmployer._id.toString(),
      hasBannerUrl: !!updatedEmployer.bannerImageUrl,
    });

    // Update user avatar and name
    const userUpdates: any = { avatarUrl };
    if (userName !== undefined && userName.trim()) {
      userUpdates.name = userName;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      userUpdates,
      { new: true }
    );

    if (updatedUser) {
      console.log("[UPDATE_PROFILE] User updated:", {
        userId: updatedUser._id.toString(),
        hasAvatarUrl: !!updatedUser.avatarUrl,
      });
    }

    revalidatePath("/employer-dashboard/settings");
    revalidatePath("/employer-dashboard");
    return { status: "SUCCESS" as const, message: "Profile updated successfully!" };
  } catch (error) {
    return handleServerError(error);
  }
};
