"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileUploadItem,
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/app/(dashboard)/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon, RefreshCwIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMessage } from "./gallery-upload";
import { Icons } from "../../../components/icons";
import { Input } from "../../../components/ui/input";
import { Spinner } from "../../../components/ui/spinner";

interface CardUploadProps {
  id: string;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileUploadItem[]) => void;
  simulateUpload?: boolean;
  disabled?: boolean;
}

const CardUpload = ({
  id,
  maxSize,
  maxFiles,
  accept = "application/*",
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
  disabled,
}: CardUploadProps) => {
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

  const [
    { isDragging },
    {
      removeFile,
      clearFiles,
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
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id,
        );

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: "uploading" as const,
          };
        }
      });

      setUploadFiles(newUploadFiles);
      onFilesChange?.(newUploadFiles);
    },
    onError: (errors) => toast.error(errors[0], { position: "top-right" }),
  });

  // Simulate upload progress for new files
  useEffect(() => {
    if (!simulateUpload) return;

    const uploadingFiles = uploadFiles.filter(
      (file) => file.status === "uploading",
    );
    if (uploadingFiles.length === 0) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== "uploading") return file;

          const increment = Math.random() * 20 + 5; // Random increment between 5-25%
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress >= 100) {
            // Simulate occasional failures (10% chance)
            const shouldFail = Math.random() < 0.1;
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ("error" as const) : ("completed" as const),
              error: shouldFail
                ? "Upload failed. Please try again."
                : undefined,
            };
          }

          return { ...file, progress: newProgress };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [uploadFiles, simulateUpload]);

  const removeUploadFile = (fileId: string) => {
    const fileToRemove = uploadFiles.find((f) => f.id === fileId);
    if (fileToRemove) {
      removeFile(fileToRemove.id);
    }
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: "uploading" as const,
              error: undefined,
            }
          : file,
      ),
    );
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative rounded-lg border border-dashed p-8 text-center transition-colors",
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
          id={id}
          className="sr-only"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              isDragging ? "bg-primary/10" : "bg-muted",
            )}
          >
            <ImageIcon
              className={cn(
                "size-5",
                isDragging ? "text-primary" : "text-muted-foreground",
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Upload files to assets library
            </h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop files here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              {getMessage(accept)} up to {formatBytes(maxSize as number)}
              {multiple && `each (max ${maxFiles as number} files)`}
            </p>
          </div>

          <Button type="button" variant="outline" onClick={openFileDialog}>
            <Icons.files className="size-4" />
            {multiple ? "Select files" : "Select a file"}
          </Button>
        </div>
      </div>

      {/* Files Grid */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-medium">
                Images {multiple && `(${uploadFiles.length}/${maxFiles})`}
              </h4>
              <div className="text-muted-foreground text-xs">
                Total:{" "}
                {formatBytes(
                  uploadFiles.reduce((acc, file) => acc + file.file.size, 0),
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" type="submit" disabled={disabled}>
                {disabled ? <Spinner variant="circle" /> : <Icons.upload />}
                {disabled ? "Uploading..." : "Upload"}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={clearFiles} variant="outline" size="icon">
                    <Icons.trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <p>Remove {multiple && "all"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {uploadFiles.map((fileItem) => (
              <div key={fileItem.id} className="group relative">
                {/* Remove button */}
                <Button
                  onClick={() => removeUploadFile(fileItem.id)}
                  variant="outline"
                  size="icon"
                  className="absolute -end-2 -top-2 z-10 size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Icons.close className="size-3" />
                </Button>

                {/* Wrapper */}
                <div className="bg-card relative overflow-hidden rounded-lg border transition-colors">
                  {/* File icon area */}
                  <div className="border-border bg-muted relative aspect-square border-b">
                    <div className="text-muted-foreground/80 flex h-full items-center justify-center">
                      {fileItem.status === "uploading" ? (
                        <div className="relative">
                          <svg
                            className="size-12 -rotate-90"
                            viewBox="0 0 48 48"
                          >
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="text-muted-foreground/20"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray={`${2 * Math.PI * 20}`}
                              strokeDashoffset={`${2 * Math.PI * 20 * (1 - fileItem.progress / 100)}`}
                              className="transition-all duration-300"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="item-center absolute inset-0 flex justify-center">
                            <Icons.file className="size-8" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-4xl">
                          <Icons.file className="size-12" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File info footer */}
                  <div className="p-3">
                    <div className="space-y-1">
                      <p className="truncate text-sm font-medium">
                        {fileItem.file.name}
                      </p>
                      <div className="relative flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs">
                          {formatBytes(fileItem.file.size)}
                        </span>

                        {fileItem.status === "error" && fileItem.error && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => retryUpload(fileItem.id)}
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive absolute end-0 -top-1.25 size-6"
                              >
                                <RefreshCwIcon className="size-3 opacity-100" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Upload failed. Retry
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardUpload;
