"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Trash2, Ban, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { deleteUserAction, toggleUserStatusAction } from "../server/admin.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  createdAt: Date;
}

interface UsersTableProps {
  initialUsers: User[];
  initialTotal: number;
  initialPage: number;
  initialRole?: string;
}

export function UsersTable({
  initialUsers,
  initialTotal,
  initialPage,
  initialRole,
}: UsersTableProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(initialRole || "all");

  const roleColors = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    employer: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    applicant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    router.push(`/admin/users?role=${role}`);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    const result = await deleteUserAction(userId);
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleToggleStatus = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to toggle status for ${userName}?`)) {
      return;
    }

    const result = await toggleUserStatusAction(userId);
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Total: {initialTotal} users
          </span>
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="applicant">Applicants</SelectItem>
              <SelectItem value="employer">Employers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden xl:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground md:hidden">
                      {user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    className={
                      roleColors[user.role as keyof typeof roleColors] ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{user.phoneNumber || "N/A"}</TableCell>
                <TableCell className="hidden xl:table-cell">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {user.role === "admin" ? (
                    <Badge variant="secondary" className="text-xs">
                      Protected
                    </Badge>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Ban className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Toggle User Status?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will suspend or activate "{user.name}". Suspended users cannot access the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleToggleStatus(user.id, user.name)}>
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{user.name}"? This will permanently remove all related data including jobs and applications.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id, user.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
