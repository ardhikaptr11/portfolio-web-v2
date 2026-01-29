"use client";

import { deleteSelectedProjects } from "@/app/(dashboard)/lib/queries/projects/actions";
import { DataTable } from "../../../table/data-table";
import { DataTableToolbar } from "../../../table/data-table-toolbar";

import { useDataTable } from "@/app/(dashboard)/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { Fragment, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { AlertModal } from "../../../modal/alert-modal";

interface ProjectsTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export const ProjectsTable = <TData extends { id: string }, TValue>({
  data,
  totalItems,
  columns,
}: ProjectsTableParams<TData, TValue>) => {
  const supabase = createClient();

  const [localData, setLocalData] = useState<TData[]>(data);
  const [showAlert, setShowAlert] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  // Realtime subscription
  useEffect(() => {
    setLocalData(data);

    const channel = supabase
      .channel("public:projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
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
        description: false,
        created_at: false,
        updated_at: false,
      },
    },
  });

  const handleClickDelete = (ids: string[]) => {
    setShowAlert(true);
    setIds(ids);
  };

  const onConfirmDelete = async (ids: string[]) => {
    startTransition(async () => {
      toast.promise(deleteSelectedProjects(ids), {
        loading: "Deleting all selected projects...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.refresh(),
            message: "All selected projects deleted successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while deleting all selected projects",
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
        description="Are you sure you want to delete all selected projects?"
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
