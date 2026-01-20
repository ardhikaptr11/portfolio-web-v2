"use client";

import { Button } from "@/components/ui/button";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { IconCloudUpload, IconFileCvFilled } from "@tabler/icons-react";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Icons } from "./icons";

interface FileUploadCompactProps {
  id: string;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  defaultFile?: string;
  disabled?: boolean;
}

const FileUploadCompact = ({
  id,
  maxFiles = 1,
  maxSize,
  accept,
  multiple = false,
  className,
  onFilesChange,
  defaultFile,
  disabled,
}: FileUploadCompactProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange: (files) => {
      if (files.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);
        // Simulate upload progress
        simulateUpload();
        onFilesChange?.(files);
      }
    },
    onError: (errors) => toast.error(errors, { position: "top-right" }),
  });

  const currentFile = files[0];

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  const simulateUpload = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        // Random progress increment between 5-15%
        const increment = Math.random() * 10 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Compact Upload Area */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed border-border p-4 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          {...getInputProps()}
          className="sr-only"
          disabled={disabled}
          id={id}
        />

        {/* Upload Button */}
        {files.length === 0 && !defaultFile && (
          <Button
            type="button"
            onClick={openFileDialog}
            size="sm"
            variant="ghost"
            className={cn("cursor-pointer", isDragging && "animate-bounce")}
          >
            <Icons.upload className="size-4" />
            Upload File
          </Button>
        )}

        {/* File Previews */}
        <div className="flex flex-1 items-center gap-2">
          {files.length === 0 && !defaultFile ? (
            <p className="text-sm text-muted-foreground">
              Drop files here or click to browse{" "}
              {maxFiles > 1 && <span>(max {maxFiles} files)</span>}
            </p>
          ) : (
            <div className="group w-full shrink-0">
              {/* File Preview */}
              {isUploading ? (
                <div className="inset-0 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <svg className="size-5 -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-white/20"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                        className="text-white transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="flex items-center space-x-2 text-sm font-medium text-white">
                      <p>{Math.round(uploadProgress)}%</p>
                      <p>Uploading...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <IconFileCvFilled className="hidden size-5 text-muted-foreground sm:block" />
                    <p>
                      {currentFile
                        ? `${currentFile?.file.name} (${formatBytes(currentFile?.file.size)})`
                        : defaultFile?.split(
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/`,
                          )[1]}
                    </p>
                  </div>
                  {/* Remove Button */}
                  {!defaultFile && (
                    <Button
                      onClick={handleRemove}
                      variant="outline"
                      size="icon"
                      className="size-5 cursor-pointer rounded-full border-2 border-background opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XIcon className="size-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* File Count */}
        {files.length > 0 && maxFiles > 1 && (
          <div className="shrink-0 text-xs text-muted-foreground">
            {files.length}/{maxFiles}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadCompact;
