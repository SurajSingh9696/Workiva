"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Applicant from "@/models/Applicant";
import Employer from "@/models/Employer";
import argon2 from "argon2";
import mongoose from "mongoose";
import {
  LoginUserData,
  loginUserSchema,
  RegisterUserData,
  registerUserSchema,
} from "../auth.schema";
import {
  createSessionAndSetCookies,
  invalidateSession,
} from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect, isRedirectError } from "next/navigation";
import crypto from "crypto";
import { handleServerError, ErrorMessages } from "@/lib/error-handler";

// 👉 Server Actions in Next.js are special functions that run only on the server, not in the user’s browser.

// They let you perform things like database queries, API calls, form submissions, or data mutations directly from your React components — without creating a separate API route.

// You just mark a function with "use server", and Next.js automatically runs it on the server.

//*When you submit a <form> in Next.js using action={yourServerAction}, the framework sends a FormData object to that server function.

// FormData is a built-in Web API type (just like Request, Response, or URLSearchParams).

// It provides methods like .get(), .set(), .append(), and .entries() — which you’re already using here.

export const registerUserAction = async (data: RegisterUserData) => {
  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);
    if (error) {
      return { status: "ERROR" as const, message: error.issues[0].message };
    }
    
    const { name, userName, email, password, role } = validatedData;

    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      if (existingUser.email === email)
        return { status: "ERROR" as const, message: "This email is already registered" };
      else
        return {
          status: "ERROR" as const,
          message: "This username is already taken",
        };
    }

    const hashPassword = await argon2.hash(password);

    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashPassword,
      role,
    });

    if (role === "applicant") {
      await Applicant.create({ userId: newUser._id });
    } else if (role === "employer") {
      await Employer.create({ userId: newUser._id });
    }
    // Note: Admin users don't need an Applicant or Employer record

    await createSessionAndSetCookies(newUser._id);

    // Redirect based on user role
    if (role === "admin") {
      redirect("/admin");
    } else if (role === "employer") {
      redirect("/employer-dashboard");
    } else {
      redirect("/dashboard");
    }
  } catch (error) {
    // Re-throw redirect errors - they're not actual errors
    if (isRedirectError(error)) {
      throw error;
    }
    return handleServerError(error);
  }
};

// type LoginData = {
//   email: string;
//   password: string;
// };

export const loginUserAction = async (data: LoginUserData) => {
  try {
    const { data: validatedData, error } = loginUserSchema.safeParse(data);
    if (error) return { status: "ERROR" as const, message: error.issues[0].message };
    
    const { email, password } = validatedData;

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return { status: "ERROR" as const, message: ErrorMessages.INVALID_CREDENTIALS };
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword)
      return { status: "ERROR" as const, message: ErrorMessages.INVALID_CREDENTIALS };

    // Check if account is deleted/suspended
    if (user.deletedAt) {
      return { 
        status: "ERROR" as const, 
        message: "Your account has been suspended or deleted. Please contact support for assistance." 
      };
    }

    await createSessionAndSetCookies(user._id);

    // Redirect based on user role
    if (user.role === "admin") {
      redirect("/admin");
    } else if (user.role === "employer") {
      redirect("/employer-dashboard");
    } else {
      redirect("/dashboard");
    }
  } catch (error) {
    // Re-throw redirect errors - they're not actual errors
    if (isRedirectError(error)) {
      throw error;
    }
    return handleServerError(error);
  }
};

// logout user
export const logoutUserAction = async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return redirect("/login");

    const hashedToken = crypto
      .createHash("sha-256")
      .update(session)
      .digest("hex");

    await invalidateSession(hashedToken);
    cookieStore.delete("session");

    return redirect("/login");
  } catch (error) {
    // Re-throw redirect errors - they're not actual errors
    if (isRedirectError(error)) {
      throw error;
    }
    // Even if logout fails, redirect to login
    return redirect("/login");
  }
};
