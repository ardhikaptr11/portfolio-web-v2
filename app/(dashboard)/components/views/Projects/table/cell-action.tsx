"use client";

import { deleteSelectedProject } from "@/app/(dashboard)/lib/queries/projects/actions";
import { IProject } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import { toast } from "sonner";
import { AlertModal } from "../../../modal/alert-modal";

export const CellAction = ({ data }: { data: IProject }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, startTransition] = useTransition();

  const router = useRouter();

  const onConfirmDelete = () => {
    setShowAlert(false);

    startTransition(async () => {
      toast.promise(deleteSelectedProject(data.slug), {
        loading: "Deleting project...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.refresh(),
            message: "Project deleted successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while deleting project",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <Fragment>
      <AlertModal
        title={`Confirm deletion of ${data.title}`}
        description="Are you sure you want to delete the selected project?"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        loading={loading}
        showButtons
        buttons={[
          {
            text: "Cancel",
            variant: "destructive",
          },
          {
            text: "Submit",
            variant: "outline",
            onClick: onConfirmDelete,
          },
        ]}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.verticalDots className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/projects/edit?slug=${data.slug}`)
            }
          >
            <Icons.edit className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAlert(true)}>
            <Icons.trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};
