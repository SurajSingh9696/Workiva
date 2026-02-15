"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { updateApplicationStatusAction } from "../server/employer.actions";
import { toast } from "sonner";

interface ApplicationStatusUpdaterProps {
  applicationId: string;
  currentStatus: string;
}

export function ApplicationStatusUpdater({
  applicationId,
  currentStatus,
}: ApplicationStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const result = await updateApplicationStatusAction(applicationId, status);

    if (result.status === "SUCCESS") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
      setStatus(currentStatus); // Revert on error
    }

    setIsUpdating(false);
  };

  // Determine which statuses should be disabled based on current status
  const isOptionDisabled = (option: string) => {
    const statusOrder = ["pending", "reviewing", "accepted", "rejected"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const optionIndex = statusOrder.indexOf(option);
    
    // Disable options that are before the current status in the sequence
    return optionIndex < currentIndex;
  };

  return (
    <div className="flex gap-3 items-center">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending" disabled={isOptionDisabled("pending")}>
            Pending
          </SelectItem>
          <SelectItem value="reviewing" disabled={isOptionDisabled("reviewing")}>
            Reviewing
          </SelectItem>
          <SelectItem value="accepted" disabled={isOptionDisabled("accepted")}>
            Accepted
          </SelectItem>
          <SelectItem value="rejected" disabled={isOptionDisabled("rejected")}>
            Rejected
          </SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={isUpdating || status === currentStatus}
        variant={status === currentStatus ? "ghost" : "default"}
      >
        {isUpdating ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
