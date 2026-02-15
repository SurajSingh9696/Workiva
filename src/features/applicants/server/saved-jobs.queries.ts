import { connectDB } from "@/lib/mongodb";
import SavedJob from "@/models/SavedJob";
import Job from "@/models/Job";
import Employer from "@/models/Employer";
import User from "@/models/User";
import Applicant from "@/models/Applicant";
import mongoose from "mongoose";

export async function getSavedJobs(userId: string) {
  await connectDB();

  // First get the applicant profile
  const applicant = await Applicant.findOne({ 
    userId: new mongoose.Types.ObjectId(userId) 
  });

  if (!applicant) {
    return [];
  }

  const savedJobs = await SavedJob.find({ 
    applicantId: applicant._id 
  })
    .populate({
      path: 'jobId',
      model: Job,
      match: { deletedAt: null }, // Filter out deleted jobs
      populate: {
        path: 'employerId',
        model: Employer,
        populate: {
          path: 'userId',
          model: User,
        },
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  // Filter out entries where jobId is null (deleted jobs)
  return savedJobs
    .filter((saved: any) => saved.jobId)
    .map((saved: any) => ({
    id: saved.jobId?._id?.toString(),
    title: saved.jobId?.title,
    description: saved.jobId?.description || '',
    location: saved.jobId?.location,
    workType: saved.jobId?.workType,
    jobType: saved.jobId?.jobType,
    minSalary: saved.jobId?.minSalary,
    maxSalary: saved.jobId?.maxSalary,
    salaryCurrency: saved.jobId?.salaryCurrency,
    salaryPeriod: saved.jobId?.salaryPeriod || 'monthly',
    createdAt: saved.jobId?.createdAt,
    companyName: saved.jobId?.employerId?.name,
    companyLogo: saved.jobId?.employerId?.userId?.avatarUrl,
    companyBanner: saved.jobId?.employerId?.bannerImageUrl,
  }));
}

export async function checkIfSaved(userId: string, jobId: string) {
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

  const saved = await SavedJob.findOne({
    applicantId: applicant._id,
    jobId: new mongoose.Types.ObjectId(jobId),
  });

  return !!saved;
}
