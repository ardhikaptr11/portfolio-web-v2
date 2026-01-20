"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TModalProps } from "../../types/modal";

export const BaseModal = ({
  title,
  description,
  isOpen,
  onClose,
  disableClose = false,
  children,
}: TModalProps) => {
  const handleChange = (open: boolean) => {
    if (!open && !disableClose && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleChange}>
      <DialogContent
        className={cn({ "[&>button]:hidden": disableClose })}
        onInteractOutside={(e) => {
          if (disableClose) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (disableClose) e.preventDefault();
        }}
        aria-describedby="Content dialog"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
