import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import Applicant from "@/models/Applicant";
import User from "@/models/User";
import Employer from "@/models/Employer";
import mongoose from "mongoose";
import { getCurrentUser } from "@/features/auth/server/auth.queries";

export async function getJobApplications(jobId: string, userId: string) {
  await connectDB();

  console.log("[GET_APPS] Fetching applications for:", { jobId, userId });

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.log("[GET_APPS] Invalid ObjectId format");
    return [];
  }

  // First get the employer profile from the user ID
  const employer = await Employer.findOne({
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!employer) {
    console.log("[GET_APPS] Employer profile not found for user:", userId);
    return [];
  }

  console.log("[GET_APPS] Employer profile found:", employer._id.toString());

  // Then verify the job belongs to this employer
  const job = await Job.findOne({
    _id: new mongoose.Types.ObjectId(jobId),
    employerId: employer._id,
  });

  if (!job) {
    console.log("[GET_APPS] Job not found or doesn't belong to employer");
    return [];
  }

  console.log("[GET_APPS] Job found:", job._id.toString());

  const jobApplications = await Application.find({ jobId: new mongoose.Types.ObjectId(jobId) })
    .populate({
      path: 'applicantId',
      populate: {
        path: 'userId',
        model: User,
      },
    })
    .populate({
      path: 'jobId',
      model: Job
    })
    .sort({ createdAt: -1 })
    .lean();

  console.log("[GET_APPS] Found applications:", jobApplications.length);
  if (jobApplications.length > 0) {
    console.log("[GET_APPS] Applications data:", (jobApplications as any[]).map((app) => ({
      id: app._id.toString(),
      applicantId: app.applicantId?._id?.toString(),
      applicantUserId: app.applicantId?.userId?._id?.toString(),
      applicantName: app.applicantId?.userId?.name,
    })));
  }

  return jobApplications.map((app: any) => ({
    id: app._id.toString(),
    status: app.status,
    coverLetter: app.coverLetter,
    resumeUrl: app.resumeUrl,
    appliedAt: app.createdAt,
    jobTitle: app.jobId?.title,
    applicantName: app.applicantId?.userId?.name,
    applicantEmail: app.applicantId?.userId?.email,
    applicantPhone: app.applicantId?.userId?.phoneNumber,
    applicantBio: app.applicantId?.biography,
    applicantLocation: app.applicantId?.location,
    applicantEducation: app.applicantId?.education,
    applicantExperience: app.applicantId?.experience,
  }));
}

export async function getEmployerStats(employerId: string) {
  await connectDB();

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(employerId)) {
    return {
      totalJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
    };
  }

  const totalJobs = await Job.countDocuments({ 
    employerId: new mongoose.Types.ObjectId(employerId) 
  });

  const jobs = await Job.find({ 
    employerId: new mongoose.Types.ObjectId(employerId) 
  }).select('_id');

  if (jobs.length === 0) {
    return {
      totalJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
    };
  }

  const jobIds = jobs.map(j => j._id);

  const totalApplications = await Application.countDocuments({
    jobId: { $in: jobIds },
  });

  const pendingApplications = await Application.countDocuments({
    jobId: { $in: jobIds },
    status: 'pending',
  });

  return {
    totalJobs,
    totalApplications,
    pendingApplications,
  };
}

export async function getAllEmployerApplications() {
  await connectDB();

  const user = await getCurrentUser();
  
  if (!user || user.role !== "employer") {
    return [];
  }

  // Get employer profile
  const employer = await Employer.findOne({
    userId: new mongoose.Types.ObjectId(user.id)
  });

  if (!employer) {
    return [];
  }

  // Get all jobs for this employer
  const jobs = await Job.find({ 
    employerId: employer._id 
  }).select('_id title');

  if (jobs.length === 0) {
    return [];
  }

  const jobIds = jobs.map(j => j._id);

  // Get all applications for these jobs
  const applications = await Application.find({
    jobId: { $in: jobIds },
  })
    .populate({
      path: 'applicantId',
      populate: {
        path: 'userId',
        model: User,
      },
    })
    .populate({
      path: 'jobId',
      model: Job
    })
    .sort({ createdAt: -1 })
    .lean();

  return applications.map((app: any) => ({
    id: app._id.toString(),
    status: app.status,
    coverLetter: app.coverLetter,
    appliedAt: app.createdAt,
    jobId: app.jobId?._id.toString(),
    jobTitle: app.jobId?.title,
    applicantName: app.applicantId?.userId?.name,
    applicantEmail: app.applicantId?.userId?.email,
    applicantPhone: app.applicantId?.userId?.phoneNumber,
    resumeUrl: app.resumeUrl,
  }));
}
