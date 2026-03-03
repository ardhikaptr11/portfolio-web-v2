"use client";

import { withAIBatch } from "@platejs/ai";
import {
  AIChatPlugin,
  AIPlugin,
  applyAISuggestions,
  streamInsertChunk,
  useChatChunk,
} from "@platejs/ai/react";
import { getPluginType, KEYS, PathApi } from "platejs";
import { usePluginOption } from "platejs/react";

import { AILoadingBar, AIMenu } from "@/components/ui/ai-menu";
import { AIAnchorElement, AILeaf } from "@/components/ui/ai-node";

import { toast } from "sonner";
import { CursorOverlayKit } from "./cursor-overlay-kit";
import { MarkdownKit } from "./markdown-kit";
import { useChat } from "@/hooks/use-chat";

interface AIError {
  message: string;
}

export const aiChatPlugin = AIChatPlugin.extend({
  options: {
    chatOptions: {
      api: "/api/ai/command",
      body: {},
      onError: (error: unknown) => {
        const aiError = error as AIError;
        const errorData = JSON.parse(aiError.message);

        toast.error(errorData.message);
      },
    },
  },
  render: {
    afterContainer: AILoadingBar,
    afterEditable: AIMenu,
    node: AIAnchorElement,
  },
  shortcuts: { show: { keys: "mod+j" } },
  useHooks: ({ editor, getOption }) => {
    useChat();

    const mode = usePluginOption(AIChatPlugin, "mode");
    const toolName = usePluginOption(AIChatPlugin, "toolName");
    useChatChunk({
      onChunk: ({ chunk, isFirst, nodes, text: content }) => {
        if (isFirst && mode === "insert") {
          editor.tf.withoutSaving(() => {
            editor.tf.insertNodes(
              {
                children: [{ text: "" }],
                type: getPluginType(editor, KEYS.aiChat),
              },
              {
                at: PathApi.next(editor.selection!.focus.path.slice(0, 1)),
              },
            );
          });
          editor.setOption(AIChatPlugin, "streaming", true);
        }

        if (mode === "insert" && nodes.length > 0) {
          withAIBatch(
            editor,
            () => {
              if (!getOption("streaming")) return;
              editor.tf.withScrolling(() => {
                streamInsertChunk(editor, chunk, {
                  textProps: {
                    [getPluginType(editor, KEYS.ai)]: true,
                  },
                });
              });
            },
            { split: isFirst },
          );
        }

        if (toolName === "edit" && mode === "chat") {
          withAIBatch(
            editor,
            () => {
              applyAISuggestions(editor, content);
            },
            {
              split: isFirst,
            },
          );
        }
      },
      onFinish: () => {
        editor.setOption(AIChatPlugin, "streaming", false);
        editor.setOption(AIChatPlugin, "_blockChunks", "");
        editor.setOption(AIChatPlugin, "_blockPath", null);
        editor.setOption(AIChatPlugin, "_mdxName", null);
      },
    });
  },
});

export const AIKit = [
  ...CursorOverlayKit,
  ...MarkdownKit,
  AIPlugin.withComponent(AILeaf),
  aiChatPlugin,
];
