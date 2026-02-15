import Link from "next/link";
import { Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlockedAccountPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back to Home button in top left */}
      <div className="p-4 sm:p-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <Lock className="h-16 w-16 text-destructive" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Account Suspended
            </h1>
            <p className="text-lg text-muted-foreground">
              Your account has been suspended or deleted by an administrator.
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-card border border-border rounded-lg space-y-3">
            <p className="text-sm text-muted-foreground">
              If you believe this is a mistake, please contact support for assistance.
            </p>
            <div className="pt-2">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
