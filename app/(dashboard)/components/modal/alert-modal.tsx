"use client";

import { Button } from "@/components/ui/button";
import { TAlertModalProps } from "../../types/modal";
import { BaseModal } from "./base-modal";

export const AlertModal = ({
  title,
  description,
  isOpen,
  onClose,
  disableClose,
  loading,
  showButtons = false,
  buttons,
}: TAlertModalProps) => {

  return (
    <BaseModal
      title={title}
      description={description}
      isOpen={isOpen}
      disableClose={disableClose}
      onClose={onClose}
    >
      {showButtons && buttons && (
        <div className="grid grid-cols-2 space-x-2 pt-6">
          {buttons.map((btn, i) => (
            <Button
              key={`btn-modal-${i}`}
              variant={btn.variant || "default"}
              disabled={loading}
              onClick={btn.onClick || onClose}
            >
              {btn.text}
            </Button>
          ))}
        </div>
      )}
    </BaseModal>
  );
};
