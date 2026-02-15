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
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-100 dark:border-blue-900",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
    },
    {
      title: "Applicants",
      value: stats.totalApplicants,
      icon: UserCheck,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      borderColor: "border-green-100 dark:border-green-900",
      iconBg: "bg-green-100 dark:bg-green-900/50",
    },
    {
      title: "Employers",
      value: stats.totalEmployers,
      icon: Building2,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      borderColor: "border-purple-100 dark:border-purple-900",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      borderColor: "border-orange-100 dark:border-orange-900",
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: CheckCircle2,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/50",
      borderColor: "border-teal-100 dark:border-teal-900",
      iconBg: "bg-teal-100 dark:bg-teal-900/50",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
      borderColor: "border-indigo-100 dark:border-indigo-900",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
      borderColor: "border-yellow-100 dark:border-yellow-900",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: TrendingUp,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950/50",
      borderColor: "border-pink-100 dark:border-pink-900",
      iconBg: "bg-pink-100 dark:bg-pink-900/50",
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
            <Card className={`${stat.bgColor} ${stat.borderColor} transition-all duration-300 hover:shadow-md hover:scale-105 border`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
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
