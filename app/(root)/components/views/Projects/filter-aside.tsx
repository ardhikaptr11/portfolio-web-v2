"use client";

import {
  PROJECT_STATUS_OPTIONS,
  ROLE_OPTIONS,
  TECH_STACK_OPTIONS,
} from "@/app/(root)/constants/items.constants";
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
import { useProjectFilters } from "@/hooks/use-filters";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const FilterAside = () => {
  const {
    filters,
    activeFiltersCount,
    resetFilters,
    debouncedSetFilters,
    setFilteredQuery,
    toggleFilter,
  } = useProjectFilters();

  const t = useTranslations("ProjectList.FilterAside");

  return (
    <aside className="lg:col-span-1">
      <Card className="border-ocean-teal/20! rounded-md">
        <CardContent className="px-6 font-mono">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.filter className="text-foreground/80 size-5" />
              <h3 className="text-ocean-teal/50 text-sm font-semibold tracking-widest uppercase">
                {t("title")}
              </h3>
              {activeFiltersCount > 0 && (
                <Badge className="bg-ocean-teal/10 text-ocean-teal rounded-none border-none text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <Button
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                className="text-ocean-teal/50 hover:text-ocean-teal h-auto p-0 text-xs tracking-tighter uppercase hover:bg-transparent"
              >
                {t("clear-button")}
              </Button>
            )}
          </div>

          <Field className="mb-6">
            <FieldLabel
              htmlFor="search"
              className="text-foreground/80 text-xs tracking-widest uppercase"
            >
              {t("subtitles.subtitle1")}
            </FieldLabel>
            <div className="relative">
              <InputGroup className="border-ocean-teal/20 focus-within:border-ocean-teal border-b transition-colors">
                <InputGroupInput
                  id="search"
                  placeholder={t("search-placeholder")}
                  key={filters.search}
                  defaultValue={filters.search}
                  className="placeholder:text-ocean-teal/20 h-9 border-none bg-transparent text-xs placeholder:text-xs"
                  onChange={(e) =>
                    debouncedSetFilters({ search: e.target.value })
                  }
                />
                <InputGroupAddon className="text-ocean-teal/30 border-none bg-transparent">
                  <Icons.search className="size-4" />
                </InputGroupAddon>
              </InputGroup>
              {filters.search && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-ocean-teal/50 hover:text-ocean-teal absolute top-1/2 right-0 size-6 -translate-y-1/2 hover:bg-transparent"
                  onClick={() => debouncedSetFilters({ search: "" })}
                >
                  <XIcon className="size-3" />
                </Button>
              )}
            </div>
          </Field>

          {/* Roles */}
          <Accordion
            type="single"
            collapsible
            defaultValue="roles"
            className="mb-8 border-none"
          >
            <AccordionItem value="roles" className="border-none">
              <AccordionTrigger className="text-foreground/80 hover:text-ocean-teal pt-0! text-xs font-bold tracking-widest uppercase hover:no-underline">
                {t("subtitles.subtitle2")}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <FieldGroup className="gap-2.5">
                  {ROLE_OPTIONS.map(({ key, label }) => (
                    <Field
                      orientation="horizontal"
                      key={key}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={key}
                        className="border-ocean-teal/30 rounded-none"
                        checked={filters.role.includes(key)}
                        onCheckedChange={() => setFilteredQuery("role", key)}
                      />
                      <FieldLabel
                        htmlFor={key}
                        className="text-foreground/60 hover:text-foreground cursor-pointer text-xs font-normal tracking-wide uppercase transition-colors"
                      >
                        {label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Project Status */}
          <Accordion
            type="single"
            collapsible
            defaultValue="status"
            className="mb-8 border-none"
          >
            <AccordionItem value="status" className="border-none">
              <AccordionTrigger className="text-foreground/80 hover:text-ocean-teal pt-0! text-xs font-bold tracking-widest uppercase hover:no-underline">
                Status
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <FieldGroup className="gap-2.5">
                  {PROJECT_STATUS_OPTIONS.map(({ key, value }) => (
                    <Field
                      orientation="horizontal"
                      key={key}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={key}
                        className="border-ocean-teal/30 rounded-none"
                        checked={filters.status.includes(value)}
                        onCheckedChange={() =>
                          setFilteredQuery("status", value)
                        }
                      />
                      <FieldLabel
                        htmlFor={key}
                        className="text-foreground/60 hover:text-foreground tracking-wkeyer text-xs font-normal uppercase transition-colors"
                      >
                        {key === "live" ? "Live" : t(`status.${key}`)}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Tech Stack */}
          <Accordion
            type="single"
            collapsible
            defaultValue="tech_stack"
            className="border-none"
          >
            <AccordionItem value="tech_stack" className="border-none">
              <AccordionTrigger className="text-foreground/80 hover:text-ocean-teal pt-0! text-xs font-bold tracking-widest uppercase hover:no-underline">
                {t("subtitles.subtitle3")}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <FieldGroup className="gap-2.5">
                  {TECH_STACK_OPTIONS.map(({ key, label }) => (
                    <Field
                      orientation="horizontal"
                      key={key}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={key}
                        className="border-ocean-teal/30 rounded-none"
                        checked={filters.tech_stack.includes(key)}
                        onCheckedChange={() => toggleFilter("tech_stack", key)}
                      />
                      <FieldLabel
                        htmlFor={key}
                        className="text-foreground/60 hover:text-foreground text-xs font-normal tracking-wider uppercase transition-colors"
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
