"use client";

import { Sortable } from "@/components/ui/sortable";
import { DataTable } from "../../../table/data-table";
import { DataTableToolbar } from "../../../table/data-table-toolbar";

import { useDataTable } from "@/app/(dashboard)/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";

import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { Fragment, useEffect, useState, useTransition } from "react";
import { deleteSelectedAssets } from "@/app/(dashboard)/lib/queries/assets/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertModal } from "../../../modal/alert-modal";

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
  const [showAlert, setShowAlert] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

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

  const handleClickDelete = (ids: string[]) => {
    setShowAlert(true);
    setIds(ids);
  };

  const onConfirmDelete = (ids: string[]) => {
    startTransition(async () => {
      toast.promise(deleteSelectedAssets(ids), {
        loading: "Deleting all selected assets...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.refresh(),
            message: "All selected assets deleted successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while deleting all selected assets",
            description: error.message,
          };
        },
      });
    });
  };


  return (
    <Fragment>
      <AlertModal
        title={`Confirm deletion of ${ids.length} selected rows`}
        description="Are you sure you want to delete all selected assets?"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        loading={isLoading}
        showButtons
        buttons={[
          {
            text: "Cancel",
            variant: "destructive",
          },
          {
            text: "Submit",
            variant: "outline",
            onClick: (ids: string[]) => onConfirmDelete(ids),
          },
        ]}
      />

      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          handleClickDelete={handleClickDelete}
          disabled={isLoading}
        />
      </DataTable>
    </Fragment>
  );
};
