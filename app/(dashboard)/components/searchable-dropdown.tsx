import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

const SearchableDropdown = ({
  item,
  options,
  defaultValue,
  onChange,
  className,
}: {
  item: string;
  options: { id: string; label: string; value: string }[];
  defaultValue?: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div className={cn("flex justify-center", className)}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-full justify-between"
            role="combobox"
            variant="outline"
          >
            {value || `Select ${item}...`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput className="h-9" placeholder={`Search ${item}...`} />
            <CommandList>
              <CommandEmpty>{`No ${item}s found.`}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? "" : option.label;
                      setValue(newValue);
                      onChange(option.id);
                      setOpen(false);
                    }}
                    value={option.value}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.label ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchableDropdown;
