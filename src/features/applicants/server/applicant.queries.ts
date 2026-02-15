import { connectDB } from "@/lib/mongodb";
import Applicant from "@/models/Applicant";
import mongoose from "mongoose";

export async function getApplicantProfile(userId: string) {
  try {
    await connectDB();

    const profile = await Applicant.findOne({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).lean();

    if (!profile) return null;

    // Convert ObjectIds to strings and format date for HTML input
    return {
      ...profile,
      _id: profile._id.toString(),
      userId: profile.userId.toString(),
      // Format dateOfBirth to YYYY-MM-DD for HTML date input
      dateOfBirth: profile.dateOfBirth 
        ? new Date(profile.dateOfBirth).toISOString().split('T')[0] 
        : null,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get applicant profile error:", error);
    }
    return null;
  }
}
