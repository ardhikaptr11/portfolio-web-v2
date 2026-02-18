"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode, Suspense, useState } from "react";
import ItemListSkeleton from "../../item-list-skeleton";
import PageContainer from "../../layout/page-container";
import FilterAside from "./component/filter-aside";
import { useExperienceFilters } from "@/app/(dashboard)/hooks/use-filters";
import {
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
} from "@/app/(dashboard)/constants/items.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageExperiences = ({
  children,
  searchKey,
}: {
  children: ReactNode;
  searchKey: string;
}) => {
  const { filters, setSort, isPending, setPerPage } = useExperienceFilters();

  return (
    <PageContainer
      scrollable
      pageTitle="Experiences"
      pageDescription="You can manage your experiences by editing information here"
      pageHeaderAction={
        <div className="flex gap-x-2">
          <div
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex cursor-default items-center gap-2 px-2 py-0.5",
            )}
          >
            <div className="flex space-x-1.5">
              <p className="text-sm font-medium">Items per page:</p>
              <Select
                value={`${filters.perPage}`}
                onValueChange={(value) => setPerPage(Number(value))}
              >
                <SelectTrigger className="h-5! cursor-pointer gap-1.5 border-none bg-transparent! px-0! py-0 ring-0!">
                  <SelectValue placeholder={`${filters.perPage}`} />
                </SelectTrigger>
                <SelectContent position="popper" align="end" sideOffset={8}>
                  {PAGE_SIZE_OPTIONS.map(({ id, label }) => (
                    <SelectItem key={id} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  className="size-4"
                >
                  <Icons.sort className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-32"
                align="end"
                sideOffset={15}
                alignOffset={-8}
              >
                <DropdownMenuRadioGroup
                  value={filters.sort}
                  onValueChange={setSort}
                >
                  {SORT_OPTIONS.map((option) => {
                    if (option.isSub) {
                      return (
                        <DropdownMenuSub key={option.id}>
                          <DropdownMenuSubTrigger className="cursor-pointer">
                            {option.label}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent sideOffset={8}>
                              {option.options?.map((sub) => {
                                const SubIcon =
                                  Icons[sub.icon as keyof typeof Icons];
                                return (
                                  <DropdownMenuRadioItem
                                    key={sub.value}
                                    value={sub.value}
                                    className="flex cursor-pointer items-center gap-2 pr-8 pl-2"
                                  >
                                    <SubIcon className="size-5" />
                                    {sub.label}
                                  </DropdownMenuRadioItem>
                                );
                              })}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      );
                    }

                    const MainIcon = Icons[option.icon as keyof typeof Icons];
                    return (
                      <DropdownMenuRadioItem
                        key={option.id}
                        value={`${option.value}`}
                        className="flex cursor-pointer items-center gap-2 pr-8 pl-2"
                      >
                        <MainIcon className="size-5" />
                        {option.label}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Add Button */}
          <Link
            href="/dashboard/experiences/new"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-xs md:text-sm",
            )}
          >
            <Icons.add className="size-4" /> New
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_3fr]">
        <FilterAside />
        <Suspense fallback={<ItemListSkeleton cardCount={3} />} key={searchKey}>
          {children}
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ManageExperiences;
