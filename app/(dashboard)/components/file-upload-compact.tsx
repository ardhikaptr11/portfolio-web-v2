"use client";

import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/app/(dashboard)/hooks/use-file-upload";
import { downloadAsset } from "@/app/(dashboard)/lib/queries/assets/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconFileCvFilled } from "@tabler/icons-react";
import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Icons } from "../../../components/icons";
import { Input } from "../../../components/ui/input";
import { environments } from "@/app/environments";

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
  const fileName = defaultFile
    ?.split(`${environments.SUPABASE_URL}/storage/v1/object/public/assets/`)[1]
    .split(".")[0];

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  const handleDownloadFile = useCallback(async (name: string) => {
    try {
      const { fileToDownload, fileName } = await downloadAsset({
        file_name: name,
      });

      const url = window.URL.createObjectURL(fileToDownload);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download file", {
        description: (error as Error).message,
        position: "top-right",
      });
    }
  }, []);

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
          "border-border flex items-center gap-3 rounded-lg border border-dashed p-4 transition-colors",
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
            <p className="text-muted-foreground text-sm">
              Drop files here or click to browse{" "}
              {maxFiles > 1 && <span>(max {maxFiles} files)</span>}
            </p>
          ) : (
            <div className="group w-full shrink-0">
              {/* File Preview */}
              {isUploading ? (
                <div className="inset-0 flex-center">
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
                    <IconFileCvFilled className="text-muted-foreground hidden size-5 sm:block" />
                    <p>
                      {currentFile
                        ? `${currentFile?.file.name} (${formatBytes(currentFile?.file.size)})`
                        : fileName}
                    </p>
                  </div>
                  {/* Remove Button */}
                  {!defaultFile ? (
                    <Button
                      onClick={handleRemove}
                      variant="outline"
                      size="icon"
                      className="border-background size-5 cursor-pointer rounded-full border-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XIcon className="size-3" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => handleDownloadFile(`${fileName}`)}
                      variant="ghost"
                      size="icon"
                      className="size-7 cursor-pointer"
                    >
                      <Icons.download className="size-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* File Count */}
        {files.length > 0 && maxFiles > 1 && (
          <div className="text-muted-foreground shrink-0 text-xs">
            {files.length}/{maxFiles}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadCompact;
