"use client";

import { IExperience } from "@/app/(dashboard)/types/data";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalize } from "@/lib/helpers";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import { AlertModal } from "../../../modal/alert-modal";

const ItemsGrid = ({ data }: { data: IExperience[] }) => {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const [loading, startTransition] = useTransition();
  const onConfirmDelete = () => {
    setShowAlert(false);

    // startTransition(async () => {
    //   toast.promise(deleteSelectedProject(data.slug), {
    //     loading: "Deleting project...",
    //     success: () => {
    //       return {
    //         duration: 1500,
    //         onAutoClose: () => router.refresh(),
    //         message: "Project deleted successfully",
    //       };
    //     },
    //     error: (error: Error) => {
    //       return {
    //         message: "Error while deleting project",
    //         description: error.message,
    //       };
    //     },
    //   });
    // });
  };

  return (
    <div className="lg:col-span-1">
      {data.map((item) => {
        const formattedStartDate = format(item.start_date, "PPP").replace(
          /\d+(st|nd|rd|th),/g,
          "",
        );
        const formattedEndDate = item.end_date
          ? format(item.end_date, "PPP").replace(/\d+(st|nd|rd|th),/g, "")
          : "Present";

        return (
          <Fragment key={item.id}>
            <AlertModal
              title={`Confirm deletion of ${item.role}`}
              description="Are you sure you want to delete the selected experience?"
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

            <Card>
              <CardContent className="space-y-3 px-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold">{item.role}</h3>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-4 p-0!">
                        <span className="sr-only">Open menu</span>
                        <Icons.verticalDots className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/experiences/edit?id=${item.id}`,
                          )
                        }
                      >
                        <Icons.edit className="mr-2 size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowAlert(true)}
                        variant="destructive"
                      >
                        <Icons.trash className="mr-2 size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col items-start justify-between sm:flex-row">
                  <div>
                    <p className="text-base">
                      {capitalize(item.work_category)}
                    </p>
                    <p className="font-sm text-muted-foreground">
                      {item.organization} |{" "}
                      {item.work_type === "online" ? "Remote" : "On-site"}
                    </p>
                  </div>
                  <div className="max-sm:text-start md:text-end">
                    <h3 className="text-base">
                      {formattedStartDate} - {formattedEndDate}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.location}
                    </p>
                  </div>
                </div>
                <ul className="list-disc pl-4">
                  {item.responsibilities.map((responsibility, idx) => (
                    <li
                      key={idx}
                      className="text-accent-foreground/80 mb-1 text-sm"
                    >
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ItemsGrid;
