import { Locale } from 'date-fns';
import { Matcher } from 'react-day-picker';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

// Base props that all form components will share
export interface BaseFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Common option type for selects, radio groups, etc.
export interface FormOption {
  value: string | boolean;
  label: string;
  disabled?: boolean;
}

export interface BaseUploadConfig {
  maxFiles?: number;
  maxSize: number;
}

// Image upload specific types
export interface AssetsUploadConfig extends BaseUploadConfig {
  accept: string;
  multiple?: boolean;
}

// Date picker specific types
export interface DatePickerConfig {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  placeholder?: string;
}

export interface ExtendedDatePickerConfig extends Omit<DatePickerConfig, "minDate" | "maxDate" | "disabledDates"> {
  locale?: Locale;
  startMonth?: Date;
  endMonth?: Date;
  defaultMonth?: Date | undefined;
  disabledDateRules?: Matcher | Matcher[] | undefined;
  disabledState?: boolean;
}

// Slider specific types
export interface SliderConfig {
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
}

// Checkbox group specific types
export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Radio group specific types
export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Textarea specific types
export interface TextareaConfig {
  maxLength?: number;
  showCharCount?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}