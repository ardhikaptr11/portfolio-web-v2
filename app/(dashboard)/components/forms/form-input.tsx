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
import { Input } from "@/components/ui/input";
import { BaseFormFieldProps } from "../../types/base-form";
import { cn } from "@/lib/utils";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  autoComplete?: "off" | "email" | "current-password";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  type = "text",
  placeholder,
  step,
  min,
  max,
  autoComplete = "off",
  disabled,
  className,
  onChange,
}: FormInputProps<TFieldValues, TName>) {
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
            <Input
              id={field.name}
              type={type}
              placeholder={placeholder}
              step={step}
              min={min}
              max={max}
              autoComplete={autoComplete}
              disabled={disabled}
              {...field}
              onChange={(e) => {
                if (type === "number") {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : parseFloat(value));
                } else {
                  onChange && onChange(e);
                  field.onChange(e.target.value);
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormInput };
