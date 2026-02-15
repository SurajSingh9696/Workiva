"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface RecentApplicationsProps {
  applications: any[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "interviewing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-lg sm:text-xl">Recent Applications</CardTitle>
        <Link href="/employer-dashboard/jobs">
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!applications || applications.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Applications will appear here once candidates start applying
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h4 className="font-semibold text-sm sm:text-base truncate">
                      {application.applicantName || "Anonymous"}
                    </h4>
                    <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">
                    Applied for: <span className="font-medium">{application.jobTitle}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Link href={`/employer-dashboard/jobs/${application.jobId}/applicants`}>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    View Details
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
