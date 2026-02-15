import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Employer from "@/models/Employer";
import User from "@/models/User";
import mongoose from "mongoose";

export interface JobFilterParams {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
}

export async function getAllJobs(filters: JobFilterParams = {}, limit?: number) {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build query conditions
  const query: any = {
    deletedAt: null,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gte: today } }
    ],
  };

  // Add search filter
  if (filters?.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { title: searchRegex },
        { tags: searchRegex },
      ],
    });
  }

  // Add other filters
  if (filters?.jobType && filters.jobType !== "all") {
    query.jobType = filters.jobType;
  }

  if (filters?.jobLevel && filters.jobLevel !== "all") {
    query.jobLevel = filters.jobLevel;
  }

  if (filters?.workType && filters.workType !== "all") {
    query.workType = filters.workType;
  }

  let jobQuery = Job.find(query)
    .populate({
      path: 'employerId',
      populate: {
        path: 'userId',
        model: User,
      },
    })
    .sort({ createdAt: -1 });

  if (limit) {
    jobQuery = jobQuery.limit(limit);
  }

  const jobsData = await jobQuery.lean();

  return jobsData.map((job: any) => ({
    id: job._id.toString(),
    title: job.title,
    description: job.description,
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    salaryCurrency: job.salaryCurrency,
    salaryPeriod: job.salaryPeriod,
    location: job.location,
    jobType: job.jobType,
    workType: job.workType,
    createdAt: job.createdAt,
    companyName: job.employerId?.name,
    companyLogo: job.employerId?.userId?.avatarUrl,
    companyBanner: job.employerId?.bannerImageUrl,
  }));
}

export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>[number];

export async function getJobById(jobId: string) {
  await connectDB();

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return null;
  }

  const job = await Job.findById(jobId)
    .populate({
      path: 'employerId',
      populate: {
        path: 'userId',
        model: User,
      },
    })
    .lean();

  if (!job) return null;

  const employer = job.employerId as any;

  return {
    id: job._id.toString(),
    title: job.title,
    description: job.description,
    tags: job.tags,
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    salaryCurrency: job.salaryCurrency,
    salaryPeriod: job.salaryPeriod,
    location: job.location,
    jobType: job.jobType,
    workType: job.workType,
    jobLevel: job.jobLevel,
    experience: job.experience,
    minEducation: job.minEducation,
    createdAt: job.createdAt,
    expiresAt: job.expiresAt,
    companyLogo: employer?.userId?.avatarUrl,
    companyBanner: employer?.bannerImageUrl,
    companyName: employer?.name,
    companyBio: employer?.description,
    companyWebsite: employer?.websiteUrl,
    companyLocation: employer?.location,
  };
}

export type JobDetailsType = Awaited<ReturnType<typeof getJobById>>;
