/**
 * Utility to check if an error is a Next.js redirect error
 * Redirect errors should be re-thrown to allow Next.js to handle navigation
 */
export function isRedirectError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "digest" in error) {
    const digest = String((error as { digest?: string }).digest);
    return digest.includes("NEXT_REDIRECT") || digest.startsWith("NEXT_");
  }
  return false;
}

/**
 * Handle authentication errors appropriately
 * Re-throws redirect errors, returns error information for actual errors
 */
export function handleAuthError(error: unknown): { 
  message: string; 
  description: string;
} {
  // Re-throw redirect errors - they're not actual errors
  if (isRedirectError(error)) {
    throw error;
  }

  // Handle different error types
  const err = error as any;
  let message = "Authentication failed";
  let description = "An unexpected error occurred. Please try again.";
  
  if (err.message?.includes('rate limit') || err.message?.includes('429')) {
    message = "Too many attempts";
    description = "Please wait 15 minutes before trying again.";
  } else if (err.message?.includes('network') || err.name === 'NetworkError') {
    message = "Network error";
    description = "Please check your internet connection and try again.";
  } else if (err.message?.includes('timeout')) {
    message = "Request timeout";
    description = "The request took too long. Please try again.";
  } else if (err.message?.includes('502') || err.message?.includes('503')) {
    message = "Service unavailable";
    description = "Our servers are temporarily unavailable. Please try again in a few minutes.";
  } else if (err.message) {
    description = err.message;
  }
  
  return { message, description };
}
