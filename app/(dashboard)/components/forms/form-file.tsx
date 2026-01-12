"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BaseFormFieldProps, FileUploadConfig, ImageUploadConfig } from "../../types/base-form";
import { FieldPath, FieldValues } from "react-hook-form";
import { FileWithPreview } from "@/hooks/use-file-upload";
import FileUploadCompact from "@/components/file-upload-compact";

interface FormAvatarUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  defaultFile: string;
  config: FileUploadConfig;
}

function FormFileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  defaultFile,
  config,
}: FormAvatarUploadProps<TFieldValues, TName>) {
  const { maxSize, acceptedTypes } = config

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel htmlFor={field.name} className="w-fit! cursor-pointer">
              {label}
              {required && <span className="-ml-1 text-red-500">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <FileUploadCompact
              id={field.name}
              onFilesChange={(fileWithPreview: FileWithPreview[] | null) =>
                field.onChange(fileWithPreview?.[0].file)
              }
              defaultFile={defaultFile}
              disabled={disabled}
              maxSize={maxSize}
              accept={acceptedTypes}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormFileUpload };
