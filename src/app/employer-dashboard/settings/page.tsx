import EmployerSettingsForm from "@/features/employers/components/employer-setting-form";
import { EmployerProfileData } from "@/features/employers/employers.schema";
import { getCurrentEmployerDetails } from "@/features/server/employers.queries";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Settings } from "lucide-react";

// Disable caching to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EmployerSettings = async () => {
  const employer = await getCurrentEmployerDetails();
  if (!employer) return redirect("/login");

  console.log("currentEmployer: ", employer);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Settings}
        title="Company Settings"
        description="Manage your company profile and preferences"
      />
      <EmployerSettingsForm
        initialData={
          {
            userName: employer.name,
            name: employer.employerDetails.name,
            description: employer.employerDetails.description,
            organizationType: employer.employerDetails.organizationType,
            teamSize: employer.employerDetails.teamSize,
            location: employer.employerDetails.location,
            websiteUrl: employer.employerDetails.websiteUrl,
            yearOfEstablishment:
              employer.employerDetails.yearOfEstablishment?.toString(),
            avatarUrl: employer.avatarUrl,
            bannerImageUrl: employer.employerDetails.bannerImageUrl,
          } as EmployerProfileData
        }
      />
    </div>
  );
};

export default EmployerSettings;
