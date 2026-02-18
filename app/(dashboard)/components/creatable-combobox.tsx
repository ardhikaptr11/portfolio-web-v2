"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/spinner";
import { valuesIn } from "lodash";
import { Plus } from "lucide-react";
import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

type ComboboxCreatableProps = {
  options: string[];
  placeholder?: string;
  defaultSelected?: string[];
  onSelectChange: (value: string[]) => void;
  onCreate: (value: string) => Promise<void>;
  disabled?: boolean;
};

const ComboboxCreatable = ({
  defaultSelected = [],
  options,
  placeholder,
  onSelectChange,
  onCreate,
  disabled,
}: ComboboxCreatableProps) => {
  const anchor = useComboboxAnchor();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] =
    useState<ComboboxCreatableProps["defaultSelected"]>(defaultSelected);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNew = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newValue = searchTerm.trim();
    if (!newValue || isCreating) return;

    if (options.includes(newValue)) {
      const updated = [...(selectedValues || []), newValue];
      setSelectedValues(updated);
      setSearchTerm("");
      return;
    }

    setIsCreating(true);

    try {
      await onCreate(newValue);

      const updated = [...(selectedValues || []), newValue];
      setSelectedValues(updated);
      setSearchTerm("");
    } catch (error) {
      toast.error("Failed to add new value", {
        description: (error as Error).message,
        position: "top-right",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full">
      <Combobox
        multiple
        autoHighlight
        items={options}
        value={selectedValues}
        onValueChange={(values) => {
          onSelectChange([...values]);
        }}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <Fragment>
                {values.map((value: string) => (
                  <ComboboxChip
                    key={value}
                    onRemove={() => {
                      const updated = selectedValues?.filter(
                        (v) => v !== value,
                      );
                      setSelectedValues(updated);
                    }}
                  >
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm) {
                      e.preventDefault();

                      const existingOption = options.find((option) =>
                        option.toLowerCase().includes(searchTerm.toLowerCase()),
                      );

                      if (existingOption) {
                        setSearchTerm("");
                      } else {
                        handleCreateNew(e);
                      }
                    }

                    if (e.key === "Backspace" && !e.currentTarget.value) {
                      const updated = selectedValues?.slice(0, -1);
                      setSelectedValues(updated);
                    }
                  }}
                  disabled={disabled}
                />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>
            {searchTerm ? (
              <Button
                type="button"
                variant="ghost"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCreateNew(e);
                }}
                className="flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm text-chart-2 transition-colors hover:bg-blue-50"
              >
                {isCreating ? (
                  <Spinner className="size-4" variant="circle" />
                ) : (
                  <Plus className="size-4" />
                )}
                {isCreating ? "Adding..." : `Add "${searchTerm}"`}
              </Button>
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No items found.
              </p>
            )}
          </ComboboxEmpty>

          <ComboboxList className="custom-scrollbar">
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (searchTerm) setSearchTerm("");

                  if (selectedValues?.includes(item)) {
                    const updated = selectedValues.filter(
                      (value) => value !== item,
                    );
                    setSelectedValues(updated);
                    return;
                  }

                  const updated = [...(selectedValues || []), item];
                  setSelectedValues(updated);
                }}
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default ComboboxCreatable;
