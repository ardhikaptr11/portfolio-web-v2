"use client";

import { Button } from "@/components/ui/button";
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "@/app/(dashboard)/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { ImageIcon, XIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Icons } from "../../../components/icons";
import { Input } from "../../../components/ui/input";
import { Spinner } from "../../../components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface GalleryUploadProps {
  id: string;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  disabled?: boolean;
}

export const getMessage = (accept: string) => {
  const typeLists = accept.split(", ");
  const totalAccepted = typeLists.length;

  if (totalAccepted === 1) {
    return accept[0].includes("*")
      ? "All image types are accepted"
      : `Only ${typeLists[0].split("/")[1].toUpperCase()} is accepted`;
  }

  return `${typeLists.map((t) => t.split("/")[1].toUpperCase()).join(", ")} are accepted`;
};

export default function GalleryUpload({
  id,
  maxFiles,
  maxSize,
  accept = "image/*",
  multiple = true,
  className,
  onFilesChange,
  disabled,
}: GalleryUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [
    { files, isDragging },
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
    onFilesChange,
    onError: (errors) => toast.error(errors[0], { position: "top-right" }),
  });

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith("image/");
  };

  return (
    <div className={cn("w-full", className)}>
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
              Upload images to assets library
            </h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop images here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              {getMessage(accept)} up to {formatBytes(maxSize as number)}
              {multiple && `each (max ${maxFiles as number} files)`}
            </p>
          </div>

          <Button type="button" variant="outline" onClick={openFileDialog}>
            <Icons.photos className="size-4" />
            {multiple ? "Select images" : "Select an image"}
          </Button>
        </div>
      </div>

      {/* Gallery Stats */}
      {files.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-medium">
              Images {multiple && `(${files.length}/${maxFiles})`}
            </h4>
            <div className="text-muted-foreground text-xs">
              Total:{" "}
              {formatBytes(
                files.reduce((acc, file) => acc + file.file.size, 0),
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button disabled={disabled} variant="outline" type="submit">
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
      )}

      {/* Image Grid */}
      {files.length > 0 && (
        <div
          className={cn("mt-6", {
            "grid gap-4 md:grid-cols-2 2xl:grid-cols-3": multiple,
          })}
        >
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className={cn(
                "group relative aspect-video",
                multiple ? "w-full" : "mx-auto w-19/20",
              )}
            >
              {isImage(fileItem.file) && fileItem.preview && (
                <Image
                  fill
                  src={fileItem.preview}
                  alt={fileItem.file.name}
                  className="size-full rounded-lg border object-fill transition-transform group-hover:scale-105"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-80">
                {/* View Button */}
                {fileItem.preview && (
                  <Button
                    onClick={() => setSelectedImage(fileItem.preview!)}
                    variant="secondary"
                    size="icon"
                    className="size-7"
                  >
                    <ZoomInIcon className="opacity-100/80" />
                  </Button>
                )}

                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  variant="secondary"
                  size="icon"
                  className="size-7"
                >
                  <Icons.close className="opacity-100/80" />
                </Button>
              </div>

              {/* File Info */}
              <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs font-medium">
                  {fileItem.file.name}
                </p>
                <p className="text-xs text-gray-300">
                  {formatBytes(fileItem.file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative flex size-full justify-center">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-full max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => setSelectedImage(null)}
              variant="secondary"
              size="icon"
              className="absolute end-2 top-2 size-7 p-0"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
