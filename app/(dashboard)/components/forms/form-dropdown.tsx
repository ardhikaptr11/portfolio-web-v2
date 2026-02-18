"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "../../types/base-form";
import SearchableDropdown from "../searchable-dropdown";

interface FormDropdownProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  item: string;
  options: { id: string; label: string; value: string }[];
  defaultValue?: string;
  className?: string;
  // onChange: (value: string) => void;
}

function FormDropdown<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  item,
  defaultValue = "",
  options,
  disabled,
  className,
}: FormDropdownProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
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
            <SearchableDropdown
              item={item}
              options={options}
              defaultValue={defaultValue}
              onChange={field.onChange}
              className="w-full"
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormDropdown };

