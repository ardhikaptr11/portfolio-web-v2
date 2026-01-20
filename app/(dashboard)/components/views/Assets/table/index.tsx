"use client";

import { DataTable } from "../../../table/data-table";
import { DataTableToolbar } from "../../../table/data-table-toolbar";

import { useDataTable } from "@/app/(dashboard)/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";

import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

interface AssetsTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export const AssetsTable = <TData extends { id: string }, TValue>({
  data,
  totalItems,
  columns,
}: AssetsTableParams<TData, TValue>) => {
  const supabase = createClient();
  const [localData, setLocalData] = useState<TData[]>(data);

  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  // Realtime subscription
  useEffect(() => {
    setLocalData(data);

    const channel = supabase
      .channel("public:assets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assets" },
        (payload) => {
          const oldData = payload.old as TData;

          setLocalData((prev) => prev.filter((u) => u.id !== oldData.id));
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [data, supabase]);

  const { table } = useDataTable({
    data: localData,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 1000,
    initialState: {
      columnVisibility: {
        updated_at: false,
        created_at: false,
      },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
};
