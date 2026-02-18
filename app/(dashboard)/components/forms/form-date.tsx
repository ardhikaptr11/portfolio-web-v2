"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enGB, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import {
  BaseFormFieldProps,
  DatePickerConfig,
  ExtendedDatePickerConfig,
} from "../../types/base-form";

interface FormDateProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  config?: ExtendedDatePickerConfig;
}

function FormDate<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  config: userDefinedConfig,
  className,
}: FormDateProps<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultConfig: ExtendedDatePickerConfig = {
    placeholder: "Pick a date",
    locale: enUS,
    startMonth: new Date(2000, 0),
    endMonth: new Date(),
    disabledDateRules: (date) => date > new Date(),
    disabledState: false,
  };

  const {
    placeholder,
    locale,
    startMonth,
    endMonth,
    defaultMonth,
    disabledDateRules,
    disabledState,
  } = {
    ...defaultConfig,
    ...userDefinedConfig,
  };

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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  id={field.name}
                  variant="outline"
                  className={cn(
                    "w-full font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={disabled || disabledState}
                >
                  {field.value ? (
                    `${format(field.value, "PPP", { locale })}`
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={field.value}
                onSelect={(selectedDate) => field.onChange(selectedDate)}
                onDayClick={() => setIsOpen(false)}
                startMonth={startMonth}
                endMonth={endMonth}
                disabled={disabledDateRules}
                defaultMonth={defaultMonth ?? field.value}
                selectTriggerClassName="w-full"
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormDate };
