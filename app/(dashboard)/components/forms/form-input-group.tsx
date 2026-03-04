"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "../../types/base-form";
import { cn } from "@/lib/utils";

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
  prefix?: string;
}

interface FormInputGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
  BaseFormFieldProps<TFieldValues, TName>,
  "type" | "description" | "disabled"
> {
  inputs: {
    [key: string]: Omit<
      InputProps<TFieldValues, TName>,
      "control" | "disabled"
    >;
  };
  disabled?: boolean;
  // errors?: FieldErrors
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
  disabled,
  // errors
}: FormInputGroupProps<TFieldValues, TName>) {
  return (
    <div className={className}>
      {label && (
        <p className="w-fit text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
      )}

      <div className="space-y-2">
        {Object.entries(inputs).map(([key, config]) => (
          <FormField
            key={key}
            control={control}
            name={config.name}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Field className="gap-2">
                    {config.label && (
                      <FieldLabel
                        htmlFor={config.name}
                        className={cn(config.className)}
                      >
                        {config.label}
                        {required && (
                          <span className="-ml-1 text-red-500">*</span>
                        )}
                      </FieldLabel>
                    )}
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        {...config}
                        id={config.name}
                        disabled={disabled}
                      />
                      {config.icon && (
                        <InputGroupAddon align="inline-start">
                          {config.icon}
                        </InputGroupAddon>
                      )}
                      {config.prefix && (
                        <InputGroupAddon align="inline-start">
                          <InputGroupText>{config.prefix}</InputGroupText>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                  </Field>
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
