"use client";

import { IFormModalProps } from "../../types/modal";
import { BaseModal } from "./base-modal";

export const FormModal = ({
  title = "Edit Asset Details",
  description,
  isOpen,
  onClose,
  children,
}: IFormModalProps) => {
  return (
    <BaseModal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      {children}
    </BaseModal>
  );
};
