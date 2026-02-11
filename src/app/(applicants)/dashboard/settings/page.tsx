import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { ApplicantSettingsForm } from "@/features/applicants/components/applicant-settings-form";
import { getApplicantProfile } from "@/features/applicants/server/applicant.queries";

export default async function ApplicantSettingsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const profile = await getApplicantProfile(user.id);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences
        </p>
      </div>

      <ApplicantSettingsForm initialData={{ user, profile }} />
    </div>
  );
}
