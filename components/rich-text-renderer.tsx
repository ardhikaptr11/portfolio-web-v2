"use client";

import { staticComponents } from "@/components/static-components";
import { createSlateEditor, Value } from "platejs";
import { PlateStatic } from "platejs/static";
import { BaseEditorKit } from "./editor-base-kit";

export const RichTextRenderer = ({
  dataToRender,
}: {
  dataToRender: Value | undefined;
}) => {
  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    components: staticComponents,
    value: dataToRender,
  });

  return <PlateStatic editor={editor} />;
};
