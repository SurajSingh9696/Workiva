"use server";

import { connectDB } from "@/lib/mongodb";
import { JobFormData, jobSchema } from "../employers/jobs/jobs.schema";
import Job from "@/models/Job";
import Employer from "@/models/Employer";
import { getCurrentUser } from "../auth/server/auth.queries";
import { Job as JobType } from "../employers/jobs/types/job.types";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { handleServerError, ErrorMessages } from "@/lib/error-handler";

export const createJobAction = async (data: JobFormData) => {
  try {
    const { success, data: result, error } = jobSchema.safeParse(data);
    if (!success) {
      return {
        status: "ERROR" as const,
        message: error.issues[0].message,
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Get employer profile
    const employer = await Employer.findOne({ 
      userId: new mongoose.Types.ObjectId(currentUser.id) 
    });

    if (!employer) {
      return { status: "ERROR" as const, message: "Please complete your employer profile first" };
    }

    await Job.create({ ...result, employerId: employer._id });
    revalidatePath("/employer-dashboard/jobs");
    return { status: "SUCCESS" as const, message: "Job posted successfully!" };
  } catch (error) {
    return handleServerError(error);
  }
};

export const getEmployerJobsAction = async (): Promise<{
  status: "SUCCESS" | "ERROR";
  data?: JobType[];
  message?: string;
}> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: ErrorMessages.UNAUTHORIZED, data: [] };
    }

    await connectDB();

    // Get employer profile
    const employer = await Employer.findOne({ 
      userId: new mongoose.Types.ObjectId(currentUser.id) 
    });

    if (!employer) {
      return { status: "ERROR", message: "Employer profile not found", data: [] };
    }

    const result = await Job.find({ 
      employerId: employer._id 
    })
      .sort({ createdAt: -1 })
      .lean();

    return { 
      status: "SUCCESS", 
      data: result.map(job => ({
        id: job._id.toString(),
        employerId: job.employerId.toString(),
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
        isFeatured: job.isFeatured,
        expiresAt: job.expiresAt,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      })) as any
    };
  } catch (error) {
    const err = handleServerError(error);
    return {
      status: "ERROR",
      message: err.message,
      data: [],
    };
  }
};

export const deleteJobAction = async (jobId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: "ERROR" as const, message: "Invalid job ID" };
    }

    // Get employer profile
    const employer = await Employer.findOne({ 
      userId: new mongoose.Types.ObjectId(currentUser.id) 
    });

    if (!employer) {
      return { status: "ERROR" as const, message: "Employer profile not found" };
    }

    // Ensure the employer can only delete their own jobs
    const result = await Job.deleteOne({
      _id: new mongoose.Types.ObjectId(jobId),
      employerId: employer._id,
    });

    if (result.deletedCount === 0) {
      return { status: "ERROR" as const, message: ErrorMessages.NOT_FOUND };
    }

    revalidatePath("/employer-dashboard/jobs");
    return { status: "SUCCESS" as const, message: "Job deleted successfully" };
  } catch (error) {
    return handleServerError(error);
  }
};

export const getJobByIdAction = async (jobId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { status: "ERROR" as const, message: ErrorMessages.NOT_AUTHENTICATED };

    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: "ERROR" as const, message: "Invalid job ID" };
    }

    // Get employer profile
    const employer = await Employer.findOne({ 
      userId: new mongoose.Types.ObjectId(currentUser.id) 
    });

    if (!employer) {
      return { status: "ERROR" as const, message: "Employer profile not found" };
    }

    const job = await Job.findOne({
      _id: new mongoose.Types.ObjectId(jobId),
      employerId: employer._id,
    }).lean();

    if (!job) {
      return { status: "ERROR" as const, message: ErrorMessages.NOT_FOUND };
    }

    // Properly serialize the job data
    const serializedJob = {
      id: job._id.toString(),
      employerId: job.employerId.toString(),
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
      isFeatured: job.isFeatured,
      expiresAt: job.expiresAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    return { status: "SUCCESS" as const, data: serializedJob };
  } catch (error) {
    return handleServerError(error);
  }
};

export const updateJobAction = async (jobId: string, values: any) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR" as const, message: ErrorMessages.UNAUTHORIZED };
    }

    await connectDB();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: "ERROR" as const, message: "Invalid job ID" };
    }

    // Get employer profile
    const employer = await Employer.findOne({ 
      userId: new mongoose.Types.ObjectId(currentUser.id) 
    });

    if (!employer) {
      return { status: "ERROR" as const, message: "Employer profile not found" };
    }

    // Perform the Update
    const result = await Job.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(jobId),
        employerId: employer._id,
      },
      {
        ...values,
        updatedAt: new Date(),
      }
    );

    if (!result) {
      return { status: "ERROR" as const, message: ErrorMessages.NOT_FOUND };
    }

    revalidatePath("/employer-dashboard/jobs");
    revalidatePath(`/employer-dashboard/jobs/${jobId}/edit`);
    return { status: "SUCCESS" as const, message: "Job updated successfully!" };
  } catch (error) {
    return handleServerError(error);
  }
};
