"use client";

// import { deleteDocumentById } from "@/app/dashboard/articles/actions";
import {
  deleteAssetById,
  updateAssetById,
} from "@/app/(dashboard)/lib/queries/assets";
import { IAsset } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { capitalize } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormInput } from "../../../forms/form-input";
import { AlertModal } from "../../../modal/alert-modal";
import { FormModal } from "../../../modal/form-modal";

const EditAssetFormSchema = z.object({
  file_name: z.string().nonempty("File name is required"),
  usage: z.string().nonempty("Please specify the usage for this asset"),
});

export const CellAction = ({ data }: { data: IAsset }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, startTransition] = useTransition();

  const router = useRouter();

  const defaultValues = {
    file_name: data.file_name,
    usage: data.usage,
  };

  const form = useForm<z.infer<typeof EditAssetFormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(EditAssetFormSchema),
    defaultValues,
  });

  const {
    formState: { isDirty, dirtyFields },
  } = form;

  const onSubmitUpdate = (payload: z.infer<typeof EditAssetFormSchema>) => {
    if (!isDirty) return toast.info("No changes detected.");

    // This is only check for the fields that have been modified
    const dataToUpdate = Object.keys(dirtyFields).reduce(
      (acc, key) => {
        const field = key as keyof typeof payload;
        acc[field] = payload[field];
        return acc;
      },
      {} as Pick<IAsset, "file_name" | "usage">,
    );

    setShowFormModal(false);

    startTransition(async () => {
      toast.promise(updateAssetById(data.id, dataToUpdate), {
        loading: "Updating asset...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.refresh(),
            message: "Asset info updated successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while updating asset info",
            description: error.message,
          };
        },
      });
    });
  };

  const onConfirmDelete = () => {
    setShowAlert(false);

    startTransition(async () => {
      toast.promise(deleteAssetById(data.id), {
        loading: "Deleting asset...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.refresh(),
            message: "Asset deleted successfully",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while deleting asset",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <Fragment>
      <AlertModal
        title={`Confirm deletion of ${data.file_name}`}
        description="Are you sure you want to delete the selected file?"
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
      <FormModal
        description="You can update the asset information below."
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          form.reset();
        }}
      >
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmitUpdate)}
          className="flex flex-col gap-4"
        >
          <FormInput
            control={form.control}
            name="file_name"
            label="File Name"
            required
            disabled={loading}
          />
          <div className="grid w-full gap-3">
            <Label htmlFor="ordering">Position Index</Label>
            <Input
              type="number"
              id="ordering"
              autoComplete="off"
              defaultValue={data.ordering}
              disabled
            />
          </div>
          <FormInput
            control={form.control}
            name="usage"
            label="Usage"
            required
            disabled={loading}
          />
          <div className="grid w-full gap-3">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              autoComplete="off"
              defaultValue={`${capitalize(data.category)}`}
              disabled
            />
          </div>
          <Button
            disabled={loading}
            className={cn("mt-2 ml-auto w-full", {
              "flex gap-1": loading,
            })}
            type="submit"
          >
            {loading ? <Spinner variant="circle" /> : "Update"}
          </Button>
        </Form>
      </FormModal>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.verticalDots className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowFormModal(true)}>
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
