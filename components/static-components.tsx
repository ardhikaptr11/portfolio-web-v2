import { SlateElementProps, SlateLeafProps } from "platejs/static";

import { List } from "./ui/block-list-static";
import { BlockquoteElementStatic } from "./ui/blockquote-node-static";
import { CalloutElementStatic } from "./ui/callout-node-static";
import { CodeBlockElementStatic } from "./ui/code-block-node-static";
import { CodeLeafStatic } from "./ui/code-node-static";
import {
  ColumnElementStatic,
  ColumnGroupElementStatic,
} from "./ui/column-node-static";
import { DateElementStatic } from "./ui/date-node-static";
import { EquationElementStatic } from "./ui/equation-node-static";
import {
  H1ElementStatic,
  H2ElementStatic,
  H3ElementStatic,
  H4ElementStatic,
  H5ElementStatic,
  H6ElementStatic,
} from "./ui/heading-node-static";
import { HighlightLeafStatic } from "./ui/highlight-node-static";
import { HrElementStatic } from "./ui/hr-node-static";
import { KbdLeafStatic } from "./ui/kbd-node-static";
import { LinkElementStatic } from "./ui/link-node-static";
import { AudioElementStatic } from "./ui/media-audio-node-static";
import { FileElementStatic } from "./ui/media-file-node-static";
import { ImageElementStatic } from "./ui/media-image-node-static";
import { VideoElementStatic } from "./ui/media-video-node-static";
import { MentionElementStatic } from "./ui/mention-node-static";
import { ParagraphElementStatic } from "./ui/paragraph-node-static";
import { SuggestionLeafStatic } from "./ui/suggestion-node-static";
import {
  TableCellElementStatic,
  TableCellHeaderElementStatic,
  TableElementStatic,
  TableRowElementStatic,
} from "./ui/table-node-static";
import { TocElementStatic } from "./ui/toc-node-static";
import { ToggleElementStatic } from "./ui/toggle-node-static";

export const staticComponents = {
  // --- Elements (Blocks) ---
  p: ParagraphElementStatic,
  h1: H1ElementStatic,
  h2: H2ElementStatic,
  h3: H3ElementStatic,
  h4: H4ElementStatic,
  h5: H5ElementStatic,
  h6: H6ElementStatic,
  blockquote: BlockquoteElementStatic,
  code_block: CodeBlockElementStatic,
  callout: CalloutElementStatic,
  hr: HrElementStatic,
  toggle: ToggleElementStatic,
  column_group: ColumnGroupElementStatic,
  column: ColumnElementStatic,
  date: DateElementStatic,
  equation: EquationElementStatic,
  toc: TocElementStatic,

  // --- Lists ---
  ul: List,
  ol: List,
  todo: List,
  li: ({ children, attributes }: SlateElementProps) => (
    <li {...attributes}>{children}</li>
  ),

  // --- Tables ---
  table: TableElementStatic,
  tr: TableRowElementStatic,
  td: TableCellElementStatic,
  th: TableCellHeaderElementStatic,

  // --- Media ---
  img: ImageElementStatic,
  video: VideoElementStatic,
  audio: AudioElementStatic,
  file: FileElementStatic,
  media_embed: VideoElementStatic,

  // --- Inline Elements ---
  a: LinkElementStatic,
  mention: MentionElementStatic,
  suggestion: SuggestionLeafStatic,

  // --- Leaves (Marks) ---
  bold: ({ children }: SlateLeafProps) => <strong>{children}</strong>,
  italic: ({ children }: SlateLeafProps) => <em>{children}</em>,
  underline: ({ children }: SlateLeafProps) => <u>{children}</u>,
  strikethrough: ({ children }: SlateLeafProps) => <s>{children}</s>,
  code: CodeLeafStatic,
  highlight: HighlightLeafStatic,
  kbd: KbdLeafStatic,

  // --- Collaboration Statics ---
  comment: ({ children }: SlateLeafProps) => <span>{children}</span>,
};
