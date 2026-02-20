"use client";

import { Button } from "@/components/ui/button";
import {
  useFileUpload,
  type FileWithPreview,
} from "@/app/(dashboard)/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Icons } from "../../../components/icons";
import { Input } from "../../../components/ui/input";

export interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar: string;
  accept: string;
  disabled?: boolean;
}

const AvatarUpload = ({
  maxSize,
  accept,
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
    accept,
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
    <div className={cn("flex items-center justify-center gap-4", className)}>
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
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="text-muted-foreground size-8" />
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
            <Icons.close className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
