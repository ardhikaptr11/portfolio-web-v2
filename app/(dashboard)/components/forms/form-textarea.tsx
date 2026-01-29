"use client";

import { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BaseFormFieldProps, TextareaConfig } from "../../types/base-form";
import { cn } from "@/lib/utils";

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string;
  config?: TextareaConfig;
}

function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  placeholder,
  config: userDefinedConfig,
  disabled,
  className,
}: FormTextareaProps<TFieldValues, TName>) {
  const defaultConfig: TextareaConfig = {
    showCharCount: false,
    rows: 4,
    resize: "none",
  };

  const config = {
    ...defaultConfig,
    ...userDefinedConfig,
  };

  const { maxLength, showCharCount, rows, resize } = config;

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
            <div className="space-y-2">
              <Textarea
                id={field.name}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                style={{
                  resize,
                  minHeight: rows ? `${rows * 1.5}em` : undefined,
                }}
                maxLength={maxLength}
                {...field}
              />
              {showCharCount && (
                <div className="flex justify-between text-sm">
                  <FormMessage />
                  <p className="ml-auto text-muted-foreground">
                    {field.value?.length || 0} / {maxLength}
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {!showCharCount && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

export { FormTextarea };
