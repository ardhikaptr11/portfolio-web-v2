import { ReactNode } from "react";

interface IBaseModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  children?: ReactNode;
}

interface IClosableModalProps extends IBaseModalProps {
  disableClose?: false;
  onClose?: () => void;
}

interface INonClosableModalProps extends IBaseModalProps {
  disableClose: true;
  onClose?: () => void;
}

type TModalProps = IClosableModalProps | INonClosableModalProps;

interface IModalButton {
  text: string;
  variant?: "link" | "default" | "destructive" | "outline";
  onClick?: () => void;
}

interface IAlertModalBaseProps extends Omit<TModalProps, "children"> {
  loading?: boolean;
}

interface IAlertModalClosableWithButton extends IAlertModalBaseProps {
  showButtons: true;
  buttons: IModalButton[];
  disableClose?: false;
  onClose: () => void;
}

interface IAlertModalClosableWithoutButton extends IAlertModalBaseProps {
  showButtons?: false;
  buttons?: never;
  disableClose?: false;
  onClose: () => void;
}

interface IFormModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// interface AlertModalWithButtonsNonClosable extends AlertModalBaseProps {
//   showButtons: true;
//   buttons: ModalButton[];
//   disableClose: true;
//   onClose?: () => void;
// }


// interface AlertModalWithoutButtonsNonClosable extends AlertModalBaseProps {
//   showButtons?: false;
//   buttons?: never;
//   disableClose: true;
//   onClose?: () => void;
// }

type TAlertModalProps =
  | IAlertModalClosableWithButton
  | IAlertModalClosableWithoutButton

export type {
  IFormModalProps,
  TModalProps,
  TAlertModalProps
}