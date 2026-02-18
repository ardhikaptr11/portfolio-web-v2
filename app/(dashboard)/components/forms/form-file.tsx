"use client";

import FileUploadCompact from "@/app/(dashboard)/components/file-upload-compact";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileWithPreview } from "@/app/(dashboard)/hooks/use-file-upload";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps, AssetsUploadConfig } from "../../types/base-form";

interface FormAvatarUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  defaultFile: string;
  config: AssetsUploadConfig;
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
              {...config}
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
