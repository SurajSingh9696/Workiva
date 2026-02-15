import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MapPin, Users } from "lucide-react";
import { JobCardProps } from "../jobs/types/job.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export const EmployerJobCard = ({ job, onDelete, onEdit }: JobCardProps) => {
  return (
    <Card className="hover:shadow-md transition overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base sm:text-lg flex-1 min-w-0 truncate">{job.title}</h3>

          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit?.(job.id)}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>

            {/* Delete with Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the job listing for
                    <span className="font-semibold text-foreground">
                      " {job.title}"
                    </span>
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete?.(job.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <Badge variant="secondary" className="truncate max-w-[120px]">{job.jobType}</Badge>
          <Badge variant="secondary" className="truncate max-w-[120px]">{job.workType}</Badge>
          <Badge variant="secondary" className="truncate max-w-[120px]">{job.jobLevel}</Badge>
        </div>

        {job.location && (
          <p className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground overflow-hidden">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </p>
        )}

        {job.minSalary && job.maxSalary && (
          <p className="text-xs sm:text-sm font-medium truncate">
            {job.salaryCurrency} {job.minSalary.toLocaleString()} - {job.maxSalary.toLocaleString()} /
            {job.salaryPeriod}
          </p>
        )}

        <Link href={`/employer-dashboard/jobs/${job.id}/applicants`} className="block">
          <Button variant="outline" className="w-full mt-2" size="sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            View Applicants
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
