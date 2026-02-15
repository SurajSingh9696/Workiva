"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { updateApplicantProfileAction } from "../server/applicant.actions";
import { toast } from "sonner";
import { User, MapPin, Calendar, Globe, Briefcase, FileText, Upload, Trash2 } from "lucide-react";

interface ApplicantSettingsFormProps {
  initialData: {
    user: any;
    profile: any;
  };
}

export function ApplicantSettingsForm({ initialData }: ApplicantSettingsFormProps) {
  const { user, profile } = initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [resumePreview, setResumePreview] = useState<string | null>(profile?.resumeUrl || null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [hasExistingResume, setHasExistingResume] = useState(!!profile?.resumeUrl);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 1MB");
      return;
    }

    if (!file.type.includes("pdf")) {
      toast.error("Only PDF files are allowed for resumes");
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setResumePreview(result.data.base64);
      setHasExistingResume(true);
      toast.success(hasExistingResume ? "Resume updated successfully" : "Resume uploaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeChange = () => {
    document.getElementById("resume")?.click();
  };

  const handleResumeRemove = () => {
    setResumePreview(null);
    setHasExistingResume(false);
    const input = document.getElementById("resume") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    toast.success("Resume removed successfully");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      biography: formData.get("biography") as string,
      dateOfBirth: formData.get("dateOfBirth") as string || null,
      nationality: formData.get("nationality") as string,
      maritalStatus: formData.get("maritalStatus") as string || null,
      gender: formData.get("gender") as string || null,
      education: formData.get("education") as string || null,
      experience: formData.get("experience") as string,
      websiteUrl: formData.get("websiteUrl") as string,
      location: formData.get("location") as string,
      resumeUrl: resumePreview || profile?.resumeUrl || null,
    };

    const result = await updateApplicantProfileAction(data);
    
    if (result && result.status === "SUCCESS") {
      toast.success(result.message);
    } else if (result) {
      toast.error(result.message);
    } else {
      toast.error("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                defaultValue={user.phoneNumber || ""}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={profile?.dateOfBirth || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" defaultValue={profile?.gender || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select name="maritalStatus" defaultValue={profile?.maritalStatus || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                defaultValue={profile?.nationality || ""}
                placeholder="e.g., American"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <Textarea
              id="biography"
              name="biography"
              defaultValue={profile?.biography || ""}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Select name="education" defaultValue={profile?.education || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="high school">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  defaultValue={profile?.location || ""}
                  placeholder="e.g., New York, USA"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              defaultValue={profile?.experience || ""}
              placeholder="Describe your work experience..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website / Portfolio URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                defaultValue={profile?.websiteUrl || ""}
                placeholder="https://yourwebsite.com"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="resume">Resume (PDF, Max 1MB)</Label>
              <div className="mt-2">
                {hasExistingResume ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                        <p className="text-xs text-green-600">Your resume is ready and will be included in applications</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResumeChange}
                        disabled={uploadingResume}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingResume ? "Updating..." : "Change Resume"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleResumeRemove}
                        disabled={uploadingResume}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Input
                        id="resume"
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeUpload}
                        disabled={uploadingResume}
                        className="cursor-pointer"
                        style={{ display: 'none' }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("resume")?.click()}
                        disabled={uploadingResume}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingResume ? "Uploading..." : "Upload Resume"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload your resume in PDF format (max 1MB). This will be included in your job applications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
