"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "../../types/base-form";

interface FormCheckProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  checkedValue?: boolean;
  onChange?: (value: string | boolean) => void;
}

function FormCheck<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  checkedValue,
  onChange,
  className,
}: FormCheckProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <FieldGroup>
              <Field orientation="horizontal" data-disabled={disabled}>
                <Checkbox
                  id={field.name}
                  {...field}
                  checked={checkedValue}
                  disabled={disabled}
                  onCheckedChange={(checked) => onChange?.(checked)}
                />
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              </Field>
            </FieldGroup>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormCheck };
