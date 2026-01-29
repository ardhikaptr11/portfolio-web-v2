"use client";

import { IProject } from "@/app/(dashboard)/types/data";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CellAction } from "./cell-action";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<IProject>[] = [
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
    accessorKey: "asset_url",
    header: "Thumbnail",
    cell: ({ row }) => (
      <div className="relative aspect-3/2">
        <Image
          src={row.getValue("asset_url")}
          alt={row.getValue("search")}
          fill
          className="rounded-lg"
        />
      </div>
    ),
    meta: { label: "Thumbnail" },
  },
  {
    id: "search",
    accessorKey: "title",
    header: "Project Title",
    cell: ({ cell }) => <div>{cell.getValue<IProject["title"]>()}</div>,
    enableColumnFilter: true,
    meta: {
      label: "Project Title",
      placeholder: "Find project...",
      variant: "text",
      icon: Text,
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ cell }) => {
      const value = cell.getValue<IProject["description"]>();

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help overflow-hidden text-ellipsis">
              {value}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="max-w-xs text-wrap">{value}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    enableColumnFilter: true,
    meta: { label: "Description" },
  },
  {
    id: "tech_stack",
    accessorKey: "tech_stack",
    header: "Tech Stack",
    cell: ({ cell }) => {
      const value = cell.getValue<IProject["tech_stack"]>().join(", ");

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help overflow-hidden text-ellipsis">
              {value}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="max-w-xs text-wrap">{value}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    meta: { label: "Tech Stack" },
  },
  {
    id: "urls",
    accessorKey: "urls",
    header: "Related Links",
    cell: ({ cell }) => {
      const urls = cell.getValue<IProject["urls"]>();

      return (
        <div className="flex flex-col gap-2 w-full max-w-82.5 mx-auto">
          {Object.entries(urls).map(([key, value]) => (
            <Link
              href={value}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {value}
            </Link>
          ))}
        </div>
      );
    },
    meta: { label: "Related Links" },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ cell }) => {
      const date = cell.getValue<IProject["created_at"]>();

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
      const date = cell.getValue<IProject["updated_at"]>();

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
