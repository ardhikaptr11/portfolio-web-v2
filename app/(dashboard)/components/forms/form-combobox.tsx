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
import ComboboxCreatable from "../creatable-combobox";

interface FormComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: string[];
  defaultSelected?: string[];
  placeholder?: string;
  disabled?: boolean;
  onCreate: (value: string) => Promise<void>;
}

function FormCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  options,
  defaultSelected,
  placeholder = "Select an option",
  disabled,
  className,
  onCreate,
}: FormComboboxProps<TFieldValues, TName>) {
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
            <ComboboxCreatable
              options={options}
              defaultSelected={defaultSelected}
              placeholder={placeholder}
              onSelectChange={(value) => {
                if (value.length > 0) field.onChange(value);
              }}
              disabled={disabled}
              onCreate={onCreate}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormCombobox };
