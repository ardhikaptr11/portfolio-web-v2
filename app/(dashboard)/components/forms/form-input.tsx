"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "../../types/base-form";

const LocalizedError = ({ message }: { message: string; }) => {
  const t = useTranslations("Contact.validation");

  return <Fragment>{t(message)}</Fragment>;
};

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
  inputClassName?: string;
  enableLocalization?: boolean;
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
  inputClassName,
  enableLocalization = false,
}: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
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
              value={field.value === " " ? "" : field.value}
              className={inputClassName}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>
            {fieldState.error?.message &&
              (enableLocalization ? (
                <LocalizedError message={fieldState.error.message} />
              ) : (
                fieldState.error.message
              ))}
          </FormMessage>
        </FormItem>
      )}
    />
  );
}

export { FormInput };

