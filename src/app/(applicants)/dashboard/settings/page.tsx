import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { ApplicantSettingsForm } from "@/features/applicants/components/applicant-settings-form";
import { getApplicantProfile } from "@/features/applicants/server/applicant.queries";
import { PageHeader } from "@/components/page-header";
import { Settings } from "lucide-react";

export default async function ApplicantSettingsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const profile = await getApplicantProfile(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Settings}
        title="Profile Settings"
        description="Manage your personal information and preferences"
      />

      <ApplicantSettingsForm initialData={{ user, profile }} />
    </div>
  );
}
