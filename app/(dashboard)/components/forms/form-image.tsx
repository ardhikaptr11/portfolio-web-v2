"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "../../types/base-form";
import ImagePreview from "../image-preview";
import { cn } from "@/lib/utils";

interface FormImageProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  previewUrl: string;
}

function FormImage<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  className,
  previewUrl,
}: FormImageProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState: { error } }) => (
        <FormItem className={className}>
          {label && (
            <p
              className={cn("w-fit! text-sm leading-none font-medium", {
                "text-destructive": error?.message,
              })}
            >
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </p>
          )}

          <FormControl>
            <ImagePreview previewUrl={previewUrl} />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormImage };
