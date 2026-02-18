import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TagInput, TagInputProps } from "emblor";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "../../types/base-form";

interface FormInputTagProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string;
  tags: TagInputProps["tags"];
  setTags: TagInputProps["setTags"];
  activeTagIndex: TagInputProps["activeTagIndex"];
  setActiveTagIndex: TagInputProps["setActiveTagIndex"];
  config: Omit<
    TagInputProps,
    "tags" | "setTags" | "activeTagIndex" | "setActiveTagIndex" | "placeholder"
  >;
}

function FormInputTag<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  placeholder,
  label,
  description,
  required,
  className,
  tags,
  setTags,
  activeTagIndex,
  setActiveTagIndex,
  config,
}: FormInputTagProps<TFieldValues, TName>) {
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
            <TagInput
              {...field}
              id={field.name}
              placeholder={placeholder}
              className="sm:min-w-112.5"
              tags={tags}
              setTags={(newTags) => {
                setTags(newTags);
                field.onChange(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              {...config}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormInputTag };
