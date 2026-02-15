"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Eye, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { deleteJobAction } from "../server/admin.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  employerId?: string;
  companyName?: string;
  location?: string;
  jobType?: string;
  createdAt: Date;
}

interface JobsTableProps {
  jobs: Job[];
  total: number;
}

export function JobsTable({ jobs, total }: JobsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const jobTypeColors: Record<string, string> = {
    "full-time": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "part-time": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    contract: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    freelance: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  const handleDelete = async (jobId: string, jobTitle: string) => {
    setDeletingId(jobId);
    const result = await deleteJobAction(jobId);
    
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total: {total} jobs
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden sm:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Type</TableHead>
              <TableHead className="hidden xl:table-cell">Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground md:hidden">
                      {job.companyName || "N/A"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{job.companyName || "N/A"}</TableCell>
                <TableCell className="hidden sm:table-cell">{job.location || "Remote"}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge
                    className={
                      jobTypeColors[job.jobType || ""] ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }
                  >
                    {job.jobType || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          disabled={deletingId === job.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Job?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{job.title}"? This action cannot be undone and will also affect related applications.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job.id, job.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
