import { getCurrentUser } from "../auth/server/auth.queries";
import Employer from "../../models/Employer";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export const getCurrentEmployerDetails = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    if (currentUser.role !== "employer") return null;

    await connectDB();

    const employer = await Employer.findOne({ 
      userId: new mongoose.Types.ObjectId(currentUser.id) 
    }).lean();

    if (!employer) return null;

    const isProfileCompleted =
      employer.name &&
      employer.description &&
      currentUser.avatarUrl &&
      employer.organizationType &&
      employer.yearOfEstablishment;

    // Convert ObjectIds to strings for client component compatibility
    const employerDetails = {
      ...employer,
      _id: employer._id.toString(),
      userId: employer.userId.toString(),
    };

    return { ...currentUser, employerDetails, isProfileCompleted };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get current employer details error:", error);
    }
    return null;
  }
};
