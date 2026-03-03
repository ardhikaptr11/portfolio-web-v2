"use client";

import { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor-kit";
import { HTMLAttributes } from "react";
import { Editor, EditorContainer } from "./ui/editor";

export interface EditorFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value?: Value;
  onChange?: (value: Value) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PlateEditor = ({
  value,
  onChange,
  placeholder = "Type here...",
  disabled,
  className,
  ...props
}: EditorFieldProps) => {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        onChange?.(value);
      }}
      {...props}
    >
      <EditorContainer className={className}>
        <Editor
          variant="none"
          disabled={disabled}
          className="dark:bg-input/30 bg-transparent size-full min-h-75 max-h-[min(500px,70vh)] overflow-y-auto px-8 pt-4 pb-16 text-base sm:px-24"
        />
      </EditorContainer>
    </Plate>
  );
};

export default PlateEditor;