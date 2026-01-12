"use client";

import AvatarUpload from "@/components/avatar-upload";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BaseFormFieldProps, ImageUploadConfig } from "../../types/base-form";
import { FieldPath, FieldValues } from "react-hook-form";
import { FileWithPreview } from "@/hooks/use-file-upload";

interface FormAvatarUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  config: ImageUploadConfig;
  defaultAvatar: string;
}

function FormAvatarUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  config,
  disabled,
  className,
  defaultAvatar,
}: FormAvatarUploadProps<TFieldValues, TName>) {
  const { maxSize, acceptedTypes } = config;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel htmlFor={field.name}>
              {label}
              {required && <span className="-ml-1 text-red-500">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <AvatarUpload
              maxSize={maxSize}
              acceptedTypes={acceptedTypes}
              defaultAvatar={defaultAvatar}
              onFileChange={(fileWithPreview: FileWithPreview | null) =>
                field.onChange(fileWithPreview?.file)
              }
              disabled={disabled}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormAvatarUpload };
