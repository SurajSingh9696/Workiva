import { getAllUsers } from "@/features/admin/server/admin.queries";
import { UsersTable } from "@/features/admin/components/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Users } from "lucide-react";

// Disable caching to ensure real-time updates
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface UsersPageProps {
  searchParams: Promise<{ page?: string; role?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  try {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const role = params.role || "all";

    const result = await getAllUsers(page, 20, role);

    return (
      <div className="space-y-6">
        <PageHeader
          icon={Users}
          title="User Management"
          description="Manage all users across the platform"
        />

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable
              initialUsers={result.users}
              initialTotal={result.total}
              initialPage={page}
              initialRole={role}
            />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Users page error:", error);
    redirect("/login");
  }
}
