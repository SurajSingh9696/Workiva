"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Users, PlusCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function QuickActions() {
  const actions = [
    {
      title: "Post a Job",
      description: "Create a new job posting",
      icon: PlusCircle,
      href: "/employer-dashboard/jobs/create",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Manage Jobs",
      description: "View and edit your postings",
      icon: FileText,
      href: "/employer-dashboard/jobs",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/50",
    },
    {
      title: "View Applicants",
      description: "Review candidate applications",
      icon: Users,
      href: "/employer-dashboard/jobs",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
    },
    {
      title: "Settings",
      description: "Update company profile",
      icon: Settings,
      href: "/employer-dashboard/settings",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 justify-start hover:shadow-md transition-all"
                  >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm sm:text-base">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
