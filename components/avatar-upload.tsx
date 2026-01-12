"use client";

import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "./ui/input";
import { toast } from "sonner";

export interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar: string;
  acceptedTypes: string;
  disabled?: boolean;
}

const AvatarUpload = ({
  maxSize,
  acceptedTypes,
  className,
  onFileChange,
  defaultAvatar,
  disabled,
}: AvatarUploadProps) => {
  const [
    { files, isDragging },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: acceptedTypes,
    multiple: false,
    onFilesChange: (files) => {
      if (files.length > 0) {
        onFileChange?.(files[0] || null);
      }
    },
    onError: (errors) =>
      toast.error(errors, {
        position: "top-right",
      }),
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  return (
    <div className={cn("flex-center gap-4", className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative size-32 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/20",
            previewUrl && "border-solid",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Input {...getInputProps()} className="sr-only" disabled={disabled} />

          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
              width={75}
              height={75}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Remove Button - only show when file is uploaded */}
        {currentFile && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="absolute end-1 top-1 size-6 rounded-full"
            aria-label="Remove avatar"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
