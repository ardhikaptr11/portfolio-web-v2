"use client";

import { Breadcrumbs } from "@/app/(dashboard)/components/breadcrumbs";
import { ModeToggle } from "@/app/(dashboard)/components/themes/theme-toggle";
import {
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
} from "@/app/(root)/constants/items.constants";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import SectionHeader from "../../section-header";
import FilterAside from "./filter-aside";

const ListingLayout = ({
  children,
  searchKey,
}: {
  children: ReactNode;
  searchKey?: string;
}) => {
  const { filters, setPerPage, setSort, isPending } = useProjectFilters();
  const t = useTranslations("ProjectList");

  return (
    <section>
      <div className="flex flex-1 flex-col p-4 md:px-6">
        <div className="flex flex-col space-y-2">
          <div className="flex place-self-center items-center gap-1.5 sm:gap-2.5 mt-12">
            <Breadcrumbs />
          </div>
          <SectionHeader
            title={t("title")}
            align="center"
            className="mb-12"
            shouldAnimate={false}
          />
          <div className="flex items-center gap-x-2 place-self-end">
            <ModeToggle />
            <div
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-input bg-white/90 dark:bg-ocean-surface! flex cursor-default items-center gap-2 rounded-xs",
              )}
            >
              <p className="text-sm font-medium">{t("buttons.per-page")} :</p>
              <Select
                value={`${filters.perPage}`}
                onValueChange={(value) => setPerPage(Number(value))}
              >
                <SelectTrigger className="h-5! cursor-pointer gap-1.5 border-none bg-transparent! px-0! py-0 ring-0!">
                  <SelectValue placeholder={`${filters.perPage}`} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  align="start"
                  sideOffset={10}
                  className="border-input rounded-xs"
                >
                  {PAGE_SIZE_OPTIONS.map((option, id) => (
                    <SelectItem key={id} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-xs" asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isPending}
                  className="bg-white/90 dark:bg-ocean-surface! size-9 border-input"
                >
                  <Icons.sort />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="border-input w-32 rounded-xs"
                align="end"
              >
                <DropdownMenuRadioGroup
                  value={filters.sort}
                  onValueChange={setSort}
                >
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuSub key={option.key}>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        {t(`buttons.sorting-by.${option.key}.text`)}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent
                          sideOffset={10}
                          className="border-input rounded-xs"
                        >
                          {option.options?.map((sub) => {
                            const SubIcon =
                              Icons[sub.icon as keyof typeof Icons];

                            return (
                              <DropdownMenuRadioItem
                                key={sub.value}
                                value={sub.value}
                                className="flex cursor-pointer items-center gap-2 pr-8 pl-2"
                                itemProp="check"
                              >
                                <SubIcon className="size-5" />
                                {t(`buttons.sorting-by.${option.key}.sub-title.${sub.key}`)}
                              </DropdownMenuRadioItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 pt-0 lg:grid-cols-[1fr_3fr]">
        <FilterAside />
        {children}
      </div>
    </section>
  );
};

export default ListingLayout;
