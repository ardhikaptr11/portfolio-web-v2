"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useLocale } from "next-intl";

const ResultIndicator = ({ totalItems }: { totalItems: number }) => {
  const { activeFiltersCount, activeChips, removeChip } = useProjectFilters();
  const locale = useLocale();

  return (
    <Card className="border-ocean-teal/20! shadow-glow! rounded-md border-x-0 border-t-0 border-b px-6">
      <CardContent className="px-0">
        <div className="flex items-end justify-between">
          <div className="space-y-1 font-mono uppercase">
            <h2 className="text-ocean-teal text-xl font-black">
              {locale === "id" ? "Daftar Proyek" : "Project List"}
            </h2>
            <p className="text-foreground/50 text-xs tracking-widest">
              {activeFiltersCount > 0
                ? locale === "id"
                  ? `Menampilkan hasil yang terfilter (${activeFiltersCount} diterapkan)`
                  : `Showing filtered results (${activeFiltersCount} applied)`
                : locale === "id"
                  ? "Menampilkan semua proyek"
                  : "Showing all projects"}
            </p>
          </div>

          <div className="space-y-1 text-end font-mono font-bold">
            <h2 className="text-foreground text-xl leading-none">
              {totalItems}
            </h2>
            <p className="text-ocean-teal/50 text-sm uppercase">
              {locale === "id"
                ? "Hasil"
                : totalItems > 1
                  ? "Results"
                  : "Result"}
            </p>
          </div>
        </div>

        <div
          className={cn("mt-6 flex flex-wrap gap-2", {
            hidden: activeFiltersCount === 0,
          })}
        >
          {activeChips.map((chip) => (
            <Badge
              variant="outline"
              className="border-ocean-teal/20 bg-ocean-teal/2 text-foreground/80 rounded-none px-2 py-1 font-mono text-[10px] font-medium"
              key={chip.id}
            >
              {chip.label}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeChip(chip)}
                className="text-ocean-teal/40 hover:text-ocean-teal ml-1.5 size-fit cursor-pointer p-0 transition-colors hover:bg-transparent"
              >
                <XIcon className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultIndicator;
