"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Send, Check } from "lucide-react";
import { useState } from "react";
import { applyToJobAction, toggleSaveJobAction } from "@/features/applicants/server/applicant.actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JobActionsProps {
  jobId: number;
  hasApplied: boolean;
  isSaved: boolean;
}

export function JobActions({ jobId, hasApplied: initialHasApplied, isSaved: initialIsSaved }: JobActionsProps) {
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async () => {
    setIsApplying(true);
    const result = await applyToJobAction(jobId, coverLetter);
    
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      setHasApplied(true);
      setShowApplyDialog(false);
      setCoverLetter("");
    } else {
      toast.error(result.message);
    }
    
    setIsApplying(false);
  };

  const handleToggleSave = async () => {
    setIsSaving(true);
    const result = await toggleSaveJobAction(jobId);
    
    if (result.status === "SUCCESS") {
      toast.success(result.message);
      setIsSaved(result.isSaved || false);
    } else {
      toast.error(result.message);
    }
    
    setIsSaving(false);
  };

  return (
    <>
      <div className="flex gap-3 w-full md:w-auto">
        {hasApplied ? (
          <Button size="lg" disabled className="w-full md:w-auto font-semibold">
            <Check className="mr-2 h-5 w-5" />
            Applied
          </Button>
        ) : (
          <Button 
            size="lg" 
            className="w-full md:w-auto font-semibold"
            onClick={() => setShowApplyDialog(true)}
          >
            <Send className="mr-2 h-5 w-5" />
            Apply Now
          </Button>
        )}
        
        <Button
          size="lg"
          variant="outline"
          onClick={handleToggleSave}
          disabled={isSaving}
          className={isSaved ? "border-blue-500 text-blue-600" : ""}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? "fill-blue-600" : ""}`} />
        </Button>
      </div>

      <AlertDialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply for this job</AlertDialogTitle>
            <AlertDialogDescription>
              Add a cover letter to strengthen your application (optional)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Why are you a good fit for this position?"
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApply} disabled={isApplying}>
              {isApplying ? "Submitting..." : "Submit Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
