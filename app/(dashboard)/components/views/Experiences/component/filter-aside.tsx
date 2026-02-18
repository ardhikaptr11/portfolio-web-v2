"use client";

import {
  DURATION_OPTIONS,
  WORK_CATEGORY_OPTIONS,
  WORK_TYPE_OPTIONS,
} from "@/app/(dashboard)/constants/items.constants";
import { useExperienceFilters } from "@/app/(dashboard)/hooks/use-filters";
import { Icons } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { XIcon } from "lucide-react";

const FilterAside = () => {
  const {
    filters,
    activeFiltersCount,
    resetFilters,
    debouncedSetFilters,
    setWorkType,
    toggleFilter,
  } = useExperienceFilters();

  return (
    <aside className="lg:col-span-1">
      <Card>
        <CardContent className="px-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.filter className="size-5" />
              <h3 className="font-semibold">Filters</h3>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="rounded-md text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <Button
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-auto cursor-pointer p-1 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>

          <Field className="mb-4">
            <FieldLabel htmlFor="search">Search</FieldLabel>
            <div className="relative">
              <InputGroup>
                <InputGroupInput
                  id="search"
                  placeholder="Search experiences..."
                  key={filters.search}
                  defaultValue={filters.search}
                  onChange={(e) =>
                    debouncedSetFilters({ search: e.target.value })
                  }
                />
                <InputGroupAddon>
                  <Icons.search />
                </InputGroupAddon>
              </InputGroup>
              {filters.search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 size-6 -translate-y-1/2 cursor-pointer p-0!"
                  onClick={() => debouncedSetFilters({ search: "" })}
                >
                  <XIcon />
                </Button>
              )}
            </div>
          </Field>
          {/* Work Category */}
          <Accordion type="single" collapsible defaultValue="work-type">
            <AccordionItem value="work-type">
              <AccordionTrigger className="cursor-pointer pt-0! hover:no-underline">
                Category
              </AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="gap-3">
                  {WORK_CATEGORY_OPTIONS.map(({ id, label }) => (
                    <Field orientation="horizontal" key={id}>
                      <Checkbox
                        id={`work-category-${id}`}
                        checked={filters.work_category.includes(id)}
                        onCheckedChange={() =>
                          toggleFilter("work_category", id)
                        }
                      />
                      <FieldLabel
                        htmlFor={`work-category-${id}`}
                        className="font-normal"
                      >
                        {label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Work Type */}
          <Accordion type="single" collapsible defaultValue="work-type">
            <AccordionItem value="work-type">
              <AccordionTrigger className="cursor-pointer pt-0! hover:no-underline">
                Type
              </AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="gap-3">
                  {WORK_TYPE_OPTIONS.map(({ id, label }) => (
                    <Field orientation="horizontal" key={id}>
                      <Checkbox
                        id={`work-type-${id}`}
                        checked={filters.work_type.includes(id)}
                        onCheckedChange={() => setWorkType(id)}
                      />
                      <FieldLabel
                        htmlFor={`work-type-${id}`}
                        className="font-normal"
                      >
                        {label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Duration */}
          <Accordion type="single" collapsible defaultValue="duration">
            <AccordionItem value="duration">
              <AccordionTrigger className="cursor-pointer pt-0! hover:no-underline">
                Duration
              </AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="gap-3">
                  {DURATION_OPTIONS.map(({ id, label }) => (
                    <Field orientation="horizontal" key={id}>
                      <Checkbox
                        id={`duration-${id}`}
                        checked={filters.duration.includes(id)}
                        onCheckedChange={() => toggleFilter("duration", id)}
                      />
                      <FieldLabel
                        htmlFor={`duration-${id}`}
                        className="font-normal"
                      >
                        {label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </aside>
  );
};

export default FilterAside;
