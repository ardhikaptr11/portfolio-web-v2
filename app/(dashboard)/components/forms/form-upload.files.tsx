"use client";

import CardUpload from "@/components/card-upload";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadItem } from "@/app/(dashboard)/hooks/use-file-upload";
import { FieldPath, FieldValues } from "react-hook-form";
import { AssetsUploadConfig, BaseFormFieldProps } from "../../types/base-form";

interface FormUploadFilesProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  config: AssetsUploadConfig;
}

function FormUploadFiles<
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
}: FormUploadFilesProps<TFieldValues, TName>) {
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
            <CardUpload
              id={field.name}
              onFilesChange={(files: FileUploadItem[]) =>
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

export { FormUploadFiles };
