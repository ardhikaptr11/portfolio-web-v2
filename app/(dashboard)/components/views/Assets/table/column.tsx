"use client";

import { IAsset } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import { CellAction } from "./cell-action";
import { CATEGORY_OPTIONS } from "./options";
import { DataTableColumnHeader } from "../../../table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<IAsset>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        slot="table-header-checkbox"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "search",
    accessorKey: "file_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IAsset["file_name"]>()}</div>,
    enableColumnFilter: true,
    meta: {
      label: "File Name",
      placeholder: "Find asset data...",
      variant: "text",
      icon: Text,
    },
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Category"
        className="mx-auto!"
      />
    ),
    cell: ({ cell }) => {
      const category = cell.getValue<IAsset["category"]>();

      return (
        <Badge variant="outline">
          {category === "image" ? <Icons.photo /> : <Icons.file />}
          {capitalize(category)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Category",
      variant: "select",
      options: CATEGORY_OPTIONS,
    },
  },
  {
    id: "usage",
    accessorKey: "usage",
    header: "Usage",
    cell: ({ cell }) => <div>{cell.getValue<IAsset["usage"]>()}</div>,
    enableColumnFilter: true,
    meta: { label: "Usage" },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ cell }) => {
      const date = cell.getValue<IAsset["created_at"]>();

      const createdAt = formatDate(date);

      return <div>{createdAt}</div>;
    },
    enableColumnFilter: true,
    meta: { label: "Created At" },
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ cell }) => {
      const date = cell.getValue<IAsset["updated_at"]>();

      const updatedAt = formatDate(date);

      const formattedTime = updatedAt.replace(".", ":");

      return <div>{formattedTime}</div>;
    },
    enableColumnFilter: true,
    meta: { label: "Last Updated" },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
