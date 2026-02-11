"use server";

import { db } from "@/config/db";
import { applications } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatusAction(
  applicationId: number,
  status: string
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    await db
      .update(applications)
      .set({ status: status as any })
      .where(eq(applications.id, applicationId));

    revalidatePath("/employer-dashboard");

    return { status: "SUCCESS", message: "Application status updated" };
  } catch (error) {
    console.error("Update application status error:", error);
    return { status: "ERROR", message: "Failed to update status" };
  }
}
