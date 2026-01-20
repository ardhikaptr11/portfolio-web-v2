"use client";

import GalleryUpload from "@/components/gallery-upload";
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
import { AssetsUploadConfig, BaseFormFieldProps } from "../../types/base-form";

interface FormUploadImagesProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  config: AssetsUploadConfig;
}

function FormUploadImages<
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
  config,
}: FormUploadImagesProps<TFieldValues, TName>) {
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
            <GalleryUpload
              id={field.name}
              onFilesChange={(files: FileWithPreview[]) =>
                field.onChange(files.map((file) => file.file))
              }
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

export { FormUploadImages };
