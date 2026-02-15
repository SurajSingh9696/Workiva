import { getRecentActivity } from "@/features/admin/server/admin.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { DeleteApplicationButton } from "@/features/employers/components/delete-application-button";
import { PageHeader } from "@/components/page-header";

// Disable caching to ensure real-time updates
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ApplicationsPage() {
  try {
    const activities = await getRecentActivity(50);

    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <div className="space-y-6">
        <PageHeader
          icon={FileText}
          title="Applications"
          description="Recent application activity across the platform"
        />

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition gap-3"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {activity.applicantName || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        Applied to: {activity.jobTitle || "Unknown Job"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge
                      className={
                        statusColors[
                          activity.status as keyof typeof statusColors
                        ] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground hidden sm:inline-block min-w-[100px] text-right">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <DeleteApplicationButton applicationId={activity.id} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Applications page error:", error);
    redirect("/login");
  }
}
