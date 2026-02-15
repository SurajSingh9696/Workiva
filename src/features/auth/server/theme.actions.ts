"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { revalidatePath } from "next/cache";

export async function updateUserThemeAction(theme: 'light' | 'dark') {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    await connectDB();
    
    await User.findByIdAndUpdate(
      currentUser.id,
      { theme },
      { new: true }
    );

    // Revalidate all paths to ensure theme is updated everywhere
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, error: "Failed to update theme" };
  }
}