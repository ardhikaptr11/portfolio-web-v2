"use client";
import { useKBar } from "kbar";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function SearchInput() {
  const { query } = useKBar();
  return (
    <div className="w-full space-y-2">
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={query.toggle}
      >
        <IconSearch className="mr-2 size-4" />
        Search...
        <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <Icons.logo />
          <p>K</p>
        </kbd>
      </Button>
    </div>
  );
}
