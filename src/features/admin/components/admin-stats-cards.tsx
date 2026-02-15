"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  UserCheck,
  Building2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalApplicants: number;
    totalEmployers: number;
    totalJobs: number;
    totalApplications: number;
    activeJobs: number;
    pendingApplications: number;
  };
}

export function AdminStatsCards({ stats }: StatsCardsProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Applicants",
      value: stats.totalApplicants,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Employers",
      value: stats.totalEmployers,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: CheckCircle2,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
