// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { getAllJobs } from "@/features/employers/jobs/server/jobs.queries";

// const JobsPage = async () => {
//   // Fetch data directly here (Server Side!)
//   const jobs = await getAllJobs();

//   console.log("jobs: ", jobs);

//   return (
//     <div>
//       <h1>Hello Jobs</h1>

//       <div className="grid gap-4">
//         {jobs.map((job) => (
//           <div key={job.id} className="border p-4 rounded">
//             <h2>
//               {job.title} , Posted By - {job.companyName}
//             </h2>

//             <Link href={`/dashboard/jobs/${job.id}`}>
//               <Button>View Detailed Job</Button>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default JobsPage;

import { JobFilters } from "@/features/applicants/jobs/components/job-filters";
import { JobCard } from "@/features/employers/jobs/components/jobCard";
import {
  getAllJobs,
  JobFilterParams,
} from "@/features/employers/jobs/server/jobs.queries";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  console.log("resolvedParams: ", resolvedParams);

  const filters: JobFilterParams = {
    search:
      typeof resolvedParams.search === "string"
        ? resolvedParams.search
        : undefined,
    jobType:
      typeof resolvedParams.jobType === "string"
        ? resolvedParams.jobType
        : undefined,
    jobLevel:
      typeof resolvedParams.jobLevel === "string"
        ? resolvedParams.jobLevel
        : undefined,
    workType:
      typeof resolvedParams.workType === "string"
        ? resolvedParams.workType
        : undefined,
  };

  // 1. Fetch data directly on the server
  const jobs = await getAllJobs(filters);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Find your Next Dream Job
        </h1>
        <p className="text-gray-500">
          Browse latest job openings from top companies.
        </p>
      </div>

      {/* 3. Add the Filter Component Here */}
      <JobFilters />

      {/* Job Grid */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No jobs found
          </h3>
          <p className="text-gray-500">
            Check back later for new opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
