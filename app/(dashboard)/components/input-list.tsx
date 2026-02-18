import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ArrayPath,
  Control,
  FieldArrayPathValue,
  FieldErrors,
  FieldValues,
  get,
  Path,
  useFieldArray,
} from "react-hook-form";
import { FormInput } from "./forms/form-input";

interface IInputListProps<T extends FieldValues> {
  nestIndex?: number;
  control: Control<T>;
  errors: FieldErrors<T>;
}

const InputList = <T extends FieldValues>({
  nestIndex,
  control,
  errors,
}: IInputListProps<T>) => {
  const namePath = (
    nestIndex !== undefined
      ? `experiences.${nestIndex}.responsibilities`
      : "responsibilities"
  ) as ArrayPath<T>;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: namePath,
  });

  const getFieldError = (index: number) => {
    const fullPath = `${namePath}.${index}`;
    return get(errors, fullPath) as { message?: string } | undefined;
  };

  const handleClearAll = () => {
    const currentValues = control._getWatch(namePath) as string[] | undefined;
    const firstValue = currentValues?.[0] || " ";

    replace([firstValue] as FieldArrayPathValue<T, ArrayPath<T>>);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p
          className={cn("w-fit text-sm leading-none font-medium", {
            "text-destructive": !!get(errors, namePath),
          })}
        >
          Responsibilities <span className="ml-0.5 text-red-500">*</span>
        </p>
        <div
          className={cn({
            "space-x-1": fields.length >= 3,
          })}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearAll}
                className={cn("size-6", { hidden: fields.length < 3 })}
              >
                <Icons.clearAll className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs text-wrap">Clear all</p>
            </TooltipContent>
          </Tooltip>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              append(" " as FieldArrayPathValue<T, ArrayPath<T>>[number])
            }
            className="size-6"
          >
            <Icons.add className="size-4" />
          </Button>
        </div>
      </div>

      {fields.map((field, index) => {
        const fieldError = getFieldError(index);

        return (
          <div key={field.id} className="flex items-center space-x-2">
            <p
              className={cn("leading-none", {
                "text-destructive": !!fieldError,
              })}
            >
              {index + 1}.
            </p>
            <FormInput
              control={control}
              name={`${namePath}.${index}` as Path<T>}
              className="w-full"
              inputClassName={cn(
                "border-0! border-b-1! bg-transparent! rounded-none h-fit p-0 focus-visible:ring-0",
                { "border-destructive!": !!fieldError },
              )}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              {...(index > 0 ? {onClick: () => remove(index)} : {})}
              className={cn("size-6", {
                "pointer-event-none hover:bg-transparent! cursor-default": index === 0,
              })}
            >
              <Icons.minus className={cn("size-4", {
                hidden: index === 0
              })} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default InputList;
