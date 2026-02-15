"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Calendar,
  Globe,
  Loader,
  Loader2,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEmployerProfileAction } from "@/features/server/employer.action";
import { toast } from "sonner";
import {
  EmployerProfileData,
  employerProfileSchema,
  organizationTypes,
  teamSizes,
} from "../employers.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/text-editor";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ComponentProps, useState, useEffect, useId } from "react";

const EmployerSettingsForm = ({
  initialData,
}: {
  initialData?: Partial<EmployerProfileData>;
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EmployerProfileData>({
    defaultValues: {
      userName: initialData?.userName || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      organizationType: initialData?.organizationType || undefined,
      teamSize: initialData?.teamSize || undefined,
      yearOfEstablishment: initialData?.yearOfEstablishment,
      websiteUrl: initialData?.websiteUrl || "",
      location: initialData?.location || "",
      avatarUrl: initialData?.avatarUrl || "",
      bannerImageUrl: initialData?.bannerImageUrl || "",
    },
    resolver: zodResolver(employerProfileSchema),
  });

  const handleFormSubmit = async (data: EmployerProfileData) => {
    console.log("Form submission data:", {
      avatarUrl: data.avatarUrl ? `${data.avatarUrl.substring(0, 50)}...` : "empty",
      bannerImageUrl: data.bannerImageUrl ? `${data.bannerImageUrl.substring(0, 50)}...` : "empty",
      name: data.name,
    });
    
    const response = await updateEmployerProfileAction(data);
    if (response.status === "SUCCESS") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
            <Controller
              name="avatarUrl"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Upload Logo *</Label>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    boxText={
                      "A photo larger than 400 pixels works best. Max photo size 1 MB. Supported formats: JPG, PNG."
                    }
                    className={cn(
                      fieldState.error &&
                        "ring-1 ring-destructive/50 rounded-lg",
                      "h-48 w-48 sm:h-64 sm:w-64 mx-auto lg:mx-0"
                    )}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="bannerImageUrl"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    boxText={
                      "Banner images optimal dimension 1520×400. Supported format JPEG, PNG. Max photo size 1 MB."
                    }
                    className={cn(
                      fieldState.error &&
                        "ring-1 ring-destructive/50 rounded-lg",
                      "h-48 sm:h-64 w-full"
                    )}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <div className="relative">
              <Input
                id="userName"
                type="text"
                placeholder="Enter your full name"
                className={`${errors.userName ? "border-destructive" : ""} `}
                {...register("userName")}
              />
            </div>
            {errors.userName && (
              <p className="text-sm text-destructive">{errors.userName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                className={`pl-10 ${errors.name ? "border-destructive" : ""} `}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Tiptap content={field.value} onChange={field.onChange} />

                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organizationType">Organization Type *</Label>

              <Controller
                name="organizationType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.organizationType && (
                <p className="text-sm text-destructive">
                  {errors.organizationType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size *</Label>
              <Controller
                name="teamSize"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select Team Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.teamSize && (
                <p className="text-sm text-destructive">
                  {errors.teamSize.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearOfEstablishment">
                Year of Establishment *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="yearOfEstablishment"
                  type="text"
                  placeholder="e.g., 2020"
                  maxLength={4}
                  className="pl-10"
                  {...register("yearOfEstablishment")}
                />
              </div>
              {errors.yearOfEstablishment && (
                <p className="text-sm text-destructive">
                  {errors.yearOfEstablishment.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Pune, Bangalore"
                  className="pl-10"
                  {...register("location")}
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="websiteUrl"
                type="text"
                placeholder="https://www.yourcompany.com"
                className="pl-10"
                {...register("websiteUrl")}
              />
            </div>
            {errors.websiteUrl && (
              <p className="text-sm text-destructive">
                {errors.websiteUrl.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader className="w-4 h-4 animate-spin mr-2" />}
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>

            {isDirty && (
              <p className="text-sm text-muted-foreground">
                You have unsaved changes
              </p>
            )}

            {!isDirty && (
              <p className="text-sm text-muted-foreground">
                No changes to save
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployerSettingsForm;

type ImageUploadProps = Omit<ComponentProps<"div">, "onChange"> & {
  value?: string;
  boxText?: string;
  onChange: (url: string) => void;
};

export const ImageUpload = ({
  value,
  onChange,
  className,
  boxText,
  ...props
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputId = useId();

  // Sync preview with value prop when it changes (e.g., from database)
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  const compressImage = async (file: File): Promise<File> => {
    // Dynamic import for browser-image-compression
    const imageCompression = (await import("browser-image-compression")).default;
    
    const options = {
      maxSizeMB: 0.9, // Compress to under 900KB (gives buffer for 1MB limit)
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
      fileType: file.type as any,
      initialQuality: 0.85, // High quality compression
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Original: ${(file.size / 1024).toFixed(2)}KB, Compressed: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      // If compression fails, return original file
      return file;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);

    try {
      // Compress the image first
      let processedFile = file;
      
      if (file.size > 1 * 1024 * 1024) {
        toast.info("Compressing image...");
        processedFile = await compressImage(file);
        
        // Check if compressed file is still too large
        if (processedFile.size > 1 * 1024 * 1024) {
          toast.error("Image is too large even after compression. Please use a smaller image.");
          return;
        }
      }

      const formData = new FormData();
      formData.append("file", processedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const base64Url = result.data.base64;
        console.log("Image uploaded successfully, base64 length:", base64Url?.length);
        setPreviewUrl(base64Url);
        onChange(base64Url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setPreviewUrl(null);
  };

  const triggerFileInput = () => {
    const input = document.getElementById(fileInputId) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  if (value || previewUrl) {
    return (
      <div
        className={cn(
          "overflow-hidden border-2 border-border relative group rounded-lg",
          className
        )}
        {...props}
      >
        <Image
          src={previewUrl || value || ""}
          alt="Uploaded image"
          height={200}
          width={200}
          className="w-full h-full object-cover"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-sm text-white font-medium">Uploading...</p>
            </div>
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <input
              type="file"
              id={fileInputId}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary/50",
        "border-muted-foreground/25",
        isUploading && "opacity-50 pointer-events-none",
        className
      )}
      onClick={triggerFileInput}
      {...props}
    >
      <input
        type="file"
        id={fileInputId}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      <div className="flex flex-col items-center py-8">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          <span className="text-primary cursor-pointer">Browse photo</span> or click here
        </p>
        {boxText && (
          <p className="text-xs text-muted-foreground text-center px-4 max-w-xs">
            {boxText}
          </p>
        )}
      </div>
    </div>
  );
};
