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
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormInputPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  type: "text" | "password";
  placeholder?: string;
  showPassword: boolean;
  setShowPassword: () => void;
}

function FormInputPassword<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> ({
  control,
  name,
  label,
  description,
  required,
  type,
  placeholder,
  disabled,
  className,
  showPassword,
  setShowPassword,
}: FormInputPasswordProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel htmlFor={field.name}>
              {label}
              {required && <span className="-ml-1 text-red-500">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <div className="relative">
              <Input
                id={field.name}
                type={type}
                placeholder={placeholder}
                autoComplete="current-password"
                disabled={disabled}
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                className="text-muted-foreground"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-muted-foreground hover:bg-transparent"
                onClick={setShowPassword}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </Button>
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormInputPassword };
