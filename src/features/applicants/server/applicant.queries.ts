import { db } from "@/config/db";
import { applicants } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getApplicantProfile(userId: number) {
  const profile = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, userId))
    .limit(1);

  return profile[0] || null;
}
