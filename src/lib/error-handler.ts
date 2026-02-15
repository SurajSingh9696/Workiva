/**
 * User-friendly error handling utility
 * Ensures actual server errors are never exposed to users
 */

import { ZodError } from "zod";
import mongoose from "mongoose";

export interface ErrorResponse {
  status: "ERROR";
  message: string;
}

export interface SuccessResponse<T = any> {
  status: "SUCCESS";
  message: string;
  data?: T;
}

export type ActionResponse<T = any> = ErrorResponse | SuccessResponse<T>;

/**
 * Maps internal errors to user-friendly messages
 */
export function handleServerError(error: unknown): ErrorResponse {
  // Development logging (never exposed to client)
  if (process.env.NODE_ENV === "development") {
    console.error("Server Error:", error);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      status: "ERROR",
      message: error.issues[0]?.message || "Invalid data provided",
    };
  }

  // Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const firstError = Object.values(error.errors)[0];
    return {
      status: "ERROR",
      message: firstError?.message || "Invalid data format",
    };
  }

  // Mongoose duplicate key errors
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern || {})[0];
    return {
      status: "ERROR",
      message: field
        ? `This ${field} is already in use`
        : "This record already exists",
    };
  }

  // Mongoose CastError (invalid ObjectId)
  if (error instanceof mongoose.Error.CastError) {
    return {
      status: "ERROR",
      message: "Invalid identifier provided",
    };
  }

  // Network/connection errors
  if (
    error instanceof Error &&
    (error.message.includes("ECONNREFUSED") ||
      error.message.includes("ETIMEDOUT"))
  ) {
    return {
      status: "ERROR",
      message: "Unable to connect to the database. Please try again later.",
    };
  }

  // Generic fallback
  return {
    status: "ERROR",
    message: "Something went wrong. Please try again later.",
  };
}

/**
 * Wrapper for server actions with automatic error handling
 */
export async function withErrorHandling<T>(
  action: () => Promise<SuccessResponse<T>>
): Promise<ActionResponse<T>> {
  try {
    return await action();
  } catch (error) {
    return handleServerError(error);
  }
}

/**
 * Common error messages for consistency
 */
export const ErrorMessages = {
  // Authentication
  INVALID_CREDENTIALS: "Invalid email or password",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  UNAUTHORIZED: "You don't have permission to perform this action",
  NOT_AUTHENTICATED: "Please login to continue",

  // Data validation
  INVALID_DATA: "Please check your input and try again",
  REQUIRED_FIELDS: "Please fill in all required fields",

  // Database operations
  NOT_FOUND: "The requested item was not found",
  ALREADY_EXISTS: "This item already exists",
  UPDATE_FAILED: "Failed to update. Please try again.",
  DELETE_FAILED: "Failed to delete. Please try again.",
  CREATE_FAILED: "Failed to create. Please try again.",

  // Network
  CONNECTION_ERROR: "Connection error. Please check your internet.",
  TIMEOUT: "Request timed out. Please try again.",

  // Generic
  UNKNOWN_ERROR: "Something went wrong. Please try again later.",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;
