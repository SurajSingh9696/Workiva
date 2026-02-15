"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, FileText, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ApplicantStatsCardsProps {
  applicationsCount: number;
  savedJobsCount: number;
  interviewInvitesCount: number;
}

export function ApplicantStatsCards({
  applicationsCount,
  savedJobsCount,
  interviewInvitesCount,
}: ApplicantStatsCardsProps) {
  const statsData = [
    {
      label: "Applications",
      value: applicationsCount,
      icon: FileText,
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-100 dark:border-blue-900",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      href: "/dashboard/applications",
    },
    {
      label: "Saved Jobs",
      value: savedJobsCount,
      icon: Bookmark,
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      borderColor: "border-purple-100 dark:border-purple-900",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      href: "/dashboard/saved-jobs",
    },
    {
      label: "Interview Invites",
      value: interviewInvitesCount,
      icon: TrendingUp,
      bgColor: "bg-green-50 dark:bg-green-950/50",
      borderColor: "border-green-100 dark:border-green-900",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400",
      href: "/dashboard/applications",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={stat.href} className="block">
              <Card
                className={`${stat.bgColor} ${stat.borderColor} transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer border`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
