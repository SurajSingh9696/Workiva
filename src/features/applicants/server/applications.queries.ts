import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import Employer from "@/models/Employer";
import Applicant from "@/models/Applicant";
import mongoose from "mongoose";

export async function getApplicantApplications(userId: string) {
  await connectDB();

  // First get the applicant profile
  const applicant = await Applicant.findOne({ 
    userId: new mongoose.Types.ObjectId(userId) 
  });

  if (!applicant) {
    return [];
  }

  const applications = await Application.find({ 
    applicantId: applicant._id 
  })
    .populate({
      path: 'jobId',
      populate: {
        path: 'employerId',
        model: Employer,
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  return applications.map((app: any) => ({
    id: app._id.toString(),
    jobId: app.jobId?._id?.toString(),
    status: app.status,
    coverLetter: app.coverLetter,
    resumeUrl: app.resumeUrl,
    appliedAt: app.createdAt,
    jobTitle: app.jobId?.title,
    location: app.jobId?.location,
    companyName: app.jobId?.employerId?.name,
    companyLogo: app.jobId?.employerId?.bannerImageUrl,
  }));
}

export async function checkIfApplied(userId: string, jobId: string) {
  await connectDB();

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
    return false;
  }

  // First get the applicant profile
  const applicant = await Applicant.findOne({ 
    userId: new mongoose.Types.ObjectId(userId) 
  });

  if (!applicant) {
    return false;
  }

  const application = await Application.findOne({
    applicantId: applicant._id,
    jobId: new mongoose.Types.ObjectId(jobId),
  });

  return !!application;
}
