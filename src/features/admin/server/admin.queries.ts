"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";
import Application from "@/models/Application";
import Applicant from "@/models/Applicant";
import Employer from "@/models/Employer";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import mongoose from "mongoose";

// Middleware to check admin access
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Dashboard Statistics
export async function getAdminDashboardStats() {
  try {
    await requireAdmin();
    await connectDB();

    const [
      totalUsers,
      totalApplicants,
      totalEmployers,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingApplications,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ role: "applicant", deletedAt: null }),
      User.countDocuments({ role: "employer", deletedAt: null }),
      Job.countDocuments({ deletedAt: null }),
      Application.countDocuments(),
      Job.countDocuments({ deletedAt: null, expiresAt: { $gt: new Date() } }),
      Application.countDocuments({ status: "pending" }),
      User.find({ deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("name email role createdAt")
        .lean(),
    ]);

    return {
      totalUsers,
      totalApplicants,
      totalEmployers,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingApplications,
      recentUsers: recentUsers.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
}

// User Growth Data (Last 30 days)
export async function getUserGrowthData() {
  try {
    await requireAdmin();
    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    return userGrowth.map((item: any) => ({
      date: item._id.date,
      role: item._id.role,
      count: item.count,
    }));
  } catch (error) {
    console.error("Error fetching user growth:", error);
    return [];
  }
}

// Job Statistics by Type
export async function getJobStatsByType() {
  try {
    await requireAdmin();
    await connectDB();

    const jobStats = await Job.aggregate([
      {
        $match: { deletedAt: null },
      },
      {
        $group: {
          _id: "$jobType",
          count: { $sum: 1 },
        },
      },
    ]);

    return jobStats.map((stat: any) => ({
      type: stat._id || "Not Specified",
      count: stat.count,
    }));
  } catch (error) {
    console.error("Error fetching job stats:", error);
    return [];
  }
}

// Application Status Distribution
export async function getApplicationStatusStats() {
  try {
    await requireAdmin();
    await connectDB();

    const statusStats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return statusStats.map((stat: any) => ({
      status: stat._id,
      count: stat.count,
    }));
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return [];
  }
}

// Get All Users with Pagination
export async function getAllUsers(page: number = 1, limit: number = 20, role?: string) {
  try {
    await requireAdmin();
    await connectDB();

    const query: any = { deletedAt: null };
    if (role && role !== "all") {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password")
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      users: users.map((user: any) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
      })),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], total: 0, totalPages: 0, currentPage: 1 };
  }
}

// Get All Jobs with Pagination
export async function getAllJobsAdmin(page: number = 1, limit: number = 20) {
  try {
    await requireAdmin();
    await connectDB();

    const [jobs, total] = await Promise.all([
      Job.find({ deletedAt: null })
        .populate("employerId")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments({ deletedAt: null }),
    ]);

    return {
      jobs: jobs.map((job: any) => ({
        id: job._id.toString(),
        title: job.title,
        employerId: job.employerId?._id?.toString(),
        companyName: job.employerId?.name,
        location: job.location,
        jobType: job.jobType,
        createdAt: job.createdAt,
      })),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], total: 0, totalPages: 0, currentPage: 1 };
  }
}

// Recent Activity
export async function getRecentActivity(limit: number = 20) {
  try {
    await requireAdmin();
    await connectDB();

    const recentApplications = await Application.find()
      .populate({
        path: "applicantId",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "jobId",
        select: "title",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return recentApplications.map((app: any) => ({
      id: app._id.toString(),
      type: "application",
      applicantName: app.applicantId?.userId?.name,
      jobTitle: app.jobId?.title,
      status: app.status,
      createdAt: app.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
}
