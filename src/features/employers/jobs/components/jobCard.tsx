import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns"; // npm i date-fns
import { MapPin, Clock, Briefcase, Banknote } from "lucide-react";
import { JobCardType } from "../server/jobs.queries"; // Import the inferred type

interface JobCardProps {
  job: JobCardType;
}

export const JobCard = ({ job }: JobCardProps) => {
  // Helper to format salary safely
  const formatSalary = () => {
    if (!job.minSalary || !job.maxSalary) return "Not Disclosed";
    return `${job.salaryCurrency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
  };

  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="group flex flex-col gap-3 sm:gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md overflow-hidden"
    >
      {/* Header: Logo & Title */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Company Logo with Fallback */}
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName || "Company Logo"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs sm:text-sm font-bold text-gray-400">
                {job.companyName?.slice(0, 2).toUpperCase() || "CO"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="truncate text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600">
              {job.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{job.companyName}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
        <div className="flex items-center gap-1 rounded-md bg-gray-100 px-1.5 sm:px-2 py-1 max-w-full overflow-hidden">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{job.location || "Remote"}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-gray-100 px-1.5 sm:px-2 py-1 whitespace-nowrap">
          <Briefcase className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{job.workType?.replace("-", " ").toUpperCase() || "Full Time"}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-gray-100 px-1.5 sm:px-2 py-1 max-w-full overflow-hidden">
          <Banknote className="h-3 w-3 flex-shrink-0" />
          <span className="truncate text-[9px] sm:text-xs">{formatSalary()}</span>
        </div>
      </div>

      {/* Footer: Time Ago */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 sm:pt-4 text-[10px] sm:text-xs text-gray-500 gap-2">
        <span className="flex items-center gap-1 min-w-0 overflow-hidden">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            Posted{" "}
            {job.createdAt && !isNaN(new Date(job.createdAt).getTime())
              ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
              : "recently"}
          </span>
        </span>

        <span className="font-medium text-blue-600 group-hover:underline whitespace-nowrap flex-shrink-0">
          View &rarr;
        </span>
      </div>
    </Link>
  );
};
