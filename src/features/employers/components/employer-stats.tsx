"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Clock, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface EmployerStats {
  openJobsCount: number;
  totalApplicationsCount: number;
  pendingApplicationsCount: number;
  interviewingCount: number;
}

interface StatsCardsProps {
  stats: EmployerStats | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      label: "Open Jobs",
      value: stats?.openJobsCount || 0,
      icon: Briefcase,
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-100 dark:border-blue-900",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Applications",
      value: stats?.totalApplicationsCount || 0,
      icon: Users,
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      borderColor: "border-orange-100 dark:border-orange-900",
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Pending Review",
      value: stats?.pendingApplicationsCount || 0,
      icon: Clock,
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
      borderColor: "border-yellow-100 dark:border-yellow-900",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Interviewing",
      value: stats?.interviewingCount || 0,
      icon: UserCheck,
      bgColor: "bg-green-50 dark:bg-green-950/50",
      borderColor: "border-green-100 dark:border-green-900",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className={`${stat.bgColor} ${stat.borderColor} transition-all duration-300 hover:shadow-md hover:scale-105`}
            >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 ${stat.iconBg} rounded-lg`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
