"use client";

import { useExperienceFilters } from "@/app/(dashboard)/hooks/use-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import React from "react";

const ResultIndicator = ({ totalItems }: { totalItems: number }) => {
  const { activeFiltersCount, activeChips, removeChip } =
    useExperienceFilters();

  return (
    <Card>
      <CardContent className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Experience Results</h2>
            <p className="font-sm text-muted-foreground">
              {activeFiltersCount > 0
                ? `Showing filtered results (${activeFiltersCount} applied)`
                : "Showing all experiences"}
            </p>
          </div>
          <div className="text-end">
            {/* This should be dynamic later */}
            <h2 className="text-lg font-bold">{totalItems}</h2>
            <p className="font-xs text-muted-foreground">
              {totalItems > 1 ? "Experiences" : "Experience"} found
            </p>
          </div>
        </div>

        <div
          className={cn("mt-4 flex flex-wrap gap-2", {
            hidden: activeFiltersCount === 0,
          })}
        >
          {activeChips.map((chip) => (
            <Badge
              variant="secondary"
              className="rounded-md text-xs font-medium"
              key={chip.id}
            >
              {chip.label}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeChip(chip)}
                className="size-fit cursor-pointer hover:bg-transparent"
              >
                <XIcon data-icon="inline-end" className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultIndicator;
