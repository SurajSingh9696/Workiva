"use server";

import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";
import Employer from "@/models/Employer";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import mongoose from "mongoose";

export async function getEmployerStats() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "employer") {
      return null;
    }

    await connectDB();

    // First get the employer profile
    const employer = await Employer.findOne({
      userId: new mongoose.Types.ObjectId(user.id)
    });

    if (!employer) {
      console.log("[STATS] Employer profile not found for user:", user.id);
      return {
        openJobsCount: 0,
        totalApplicationsCount: 0,
        pendingApplicationsCount: 0,
        interviewingCount: 0
      };
    }

    console.log("[STATS] Employer profile found:", employer._id.toString());

    // Get counts in parallel for better performance
    const [openJobsCount, totalApplicationsCount, pendingApplicationsCount, interviewingCount] = await Promise.all([
      // Count open/active jobs for this employer
      Job.countDocuments({ 
        employerId: employer._id,
        deletedAt: null 
      }),
      
      // Count all applications to this employer's jobs
      Application.aggregate([
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: '$job'
        },
        {
          $match: {
            'job.employerId': employer._id
          }
        },
        {
          $count: 'total'
        }
      ]).then(result => result[0]?.total || 0),

      // Count pending applications
      Application.aggregate([
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: '$job'
        },
        {
          $match: {
            'job.employerId': employer._id,
            status: 'pending'
          }
        },
        {
          $count: 'total'
        }
      ]).then(result => result[0]?.total || 0),

      // Count interviewing applications
      Application.aggregate([
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        },
        {
          $unwind: '$job'
        },
        {
          $match: {
            'job.employerId': employer._id,
            status: 'interviewing'
          }
        },
        {
          $count: 'total'
        }
      ]).then(result => result[0]?.total || 0)
    ]);

    return {
      openJobsCount,
      totalApplicationsCount,
      pendingApplicationsCount,
      interviewingCount
    };
  } catch (error) {
    console.error("Error fetching employer stats:", error);
    return null;
  }
}

export async function getRecentApplications() {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "employer") {
      return [];
    }

    await connectDB();

    // First get the employer profile
    const employer = await Employer.findOne({
      userId: new mongoose.Types.ObjectId(user.id)
    });

    if (!employer) {
      console.log("[RECENT_APPS] Employer profile not found for user:", user.id);
      return [];
    }

    console.log("[RECENT_APPS] Employer profile found:", employer._id.toString());

    // Get recent applications to this employer's jobs
    const recentApplications = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      {
        $unwind: '$job'
      },
      {
        $match: {
          'job.employerId': employer._id
        }
      },
      {
        $lookup: {
          from: 'applicants',
          localField: 'applicantId',
          foreignField: '_id',
          as: 'applicant'
        }
      },
      {
        $unwind: '$applicant'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'applicant.userId',
          foreignField: '_id',
          as: 'applicantUser'
        }
      },
      {
        $unwind: '$applicantUser'
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 1,
          jobId: '$job._id',
          jobTitle: '$job.title',
          applicantName: '$applicantUser.name',
          status: 1,
          appliedAt: '$createdAt'
        }
      }
    ]);

    return recentApplications.map(app => ({
      id: app._id.toString(),
      jobId: app.jobId.toString(),
      jobTitle: app.jobTitle,
      applicantName: app.applicantName,
      status: app.status,
      appliedAt: app.appliedAt
    }));
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    return [];
  }
}
