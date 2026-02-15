"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

interface RecentUsersTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }>;
}

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  const roleColors = {
    admin: "bg-red-100 text-red-800",
    employer: "bg-purple-100 text-purple-800",
    applicant: "bg-green-100 text-green-800",
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent User Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  className={
                    roleColors[user.role as keyof typeof roleColors] ||
                    "bg-gray-100 text-gray-800"
                  }
                >
                  {user.role}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
