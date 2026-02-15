"use server";

import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";
import User from "@/models/User";
import { getCurrentUser } from "@/features/auth/server/auth.queries";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Application Trends (Last 60 days)
export async function getApplicationTrends() {
  try {
    await requireAdmin();
    await connectDB();

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const trends = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: sixtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    return trends.map((item: any) => ({
      date: item._id.date,
      status: item._id.status,
      count: item.count,
    }));
  } catch (error) {
    console.error("Error fetching application trends:", error);
    return [];
  }
}

// Jobs by Work Type
export async function getJobsByWorkType() {
  try {
    await requireAdmin();
    await connectDB();

    const workTypeStats = await Job.aggregate([
      {
        $match: { deletedAt: null },
      },
      {
        $group: {
          _id: "$workType",
          count: { $sum: 1 },
        },
      },
    ]);

    return workTypeStats.map((stat: any) => ({
      type: stat._id || "Not Specified",
      count: stat.count,
    }));
  } catch (error) {
    console.error("Error fetching work type stats:", error);
    return [];
  }
}

// Top Employers by Job Posts
export async function getTopEmployers() {
  try {
    await requireAdmin();
    await connectDB();

    const topEmployers = await Job.aggregate([
      {
        $match: { deletedAt: null },
      },
      {
        $group: {
          _id: "$employerId",
          jobCount: { $sum: 1 },
        },
      },
      {
        $sort: { jobCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "employers",
          localField: "_id",
          foreignField: "_id",
          as: "employer",
        },
      },
      {
        $unwind: "$employer",
      },
      {
        $project: {
          name: "$employer.name",
          jobCount: 1,
        },
      },
    ]);

    return topEmployers.map((employer: any) => ({
      name: employer.name || "Unknown",
      jobCount: employer.jobCount,
    }));
  } catch (error) {
    console.error("Error fetching top employers:", error);
    return [];
  }
}

// Success Rate (Accepted / Total Applications)
export async function getSuccessRateData() {
  try {
    await requireAdmin();
    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const successRates = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          total: 1,
          accepted: 1,
          successRate: {
            $multiply: [{ $divide: ["$accepted", "$total"] }, 100],
          },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return successRates.map((item: any) => ({
      date: item.date,
      total: item.total,
      accepted: item.accepted,
      successRate: parseFloat(item.successRate.toFixed(2)),
    }));
  } catch (error) {
    console.error("Error fetching success rate:", error);
    return [];
  }
}
