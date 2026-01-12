"use client";

import { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { BaseFormFieldProps } from "../../types/base-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  autoComplete?: "off" | "email" | "current-password";
  icon?: React.ReactNode;
}

interface FormInputGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
  BaseFormFieldProps<TFieldValues, TName>,
  "type" | "description" | "disabled"
> {
  inputs: {
    [key: string]: Omit<InputProps<TFieldValues, TName>, "control" | "name">;
  };
}

function FormInputGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  label,
  name,
  inputs,
  className,
  required,
}: FormInputGroupProps<TFieldValues, TName>) {
  return (
    <div className={className}>
      {label && (
        <p className="w-fit text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </p>
      )}

      <div className="grid space-y-2">
        {Object.entries(inputs).map(([key, config]) => (
          <FormField
            key={key}
            control={control}
            name={`${name}.${key}` as TName}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      {...config}
                      id={`${name}.${key}`}
                    />
                    {config.icon && (
                      <InputGroupAddon>{config.icon}</InputGroupAddon>
                    )}
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}

export { FormInputGroup };
