import type { ChatMessage, ToolName } from "@/hooks/use-chat";
import type { NextRequest } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  type LanguageModel,
  type UIMessageStreamWriter,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  Output,
  streamText,
  tool,
} from 'ai';
import { NextResponse } from 'next/server';
import { createSlateEditor, nanoid } from 'platejs';
import { z } from 'zod';
import { BaseEditorKit } from '@/components/editor-base-kit';
import { markdownJoinerTransform } from '@/lib/markdown-joiner-transform';
import {
  buildEditTableMultiCellPrompt,
  getChooseToolPrompt,
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from './prompt';
import { environments } from '@/app/environments';
import readUserSession from '@/lib/read-session';

export async function POST(req: NextRequest) {
  try {
    const user = await readUserSession();

    const role = user?.app_metadata?.role;

    if (role !== 'owner') {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You are not authorized to use this feature."
        },
        { status: 403 }
      );
    }

    const { ctx, messages: messagesRaw } = await req.json();

    const apiKey = environments.GOOGLE_GENERATIVE_AI;
    const model = environments.GOOGLE_GENERATIVE_AI_MODEL;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing API key.' },
        { status: 401 }
      );
    }

    const { children, selection, toolName: toolNameParam } = ctx;

    const editor = createSlateEditor({
      plugins: BaseEditorKit,
      selection,
      value: children,
    });

    const isSelecting = editor.api.isExpanded();
    const getModel = (modelId: string): LanguageModel => {
      const actualModelId = modelId.includes('/') ? modelId.split('/')[1] : modelId;
      return createGoogleGenerativeAI({ apiKey })(actualModelId);
    };

    const stream = createUIMessageStream<any>({
      execute: async ({ writer }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const prompt = getChooseToolPrompt({
            isSelecting,
            messages: messagesRaw,
          });

          const enumOptions = isSelecting
            ? ['generate', 'edit', 'comment']
            : ['generate', 'comment'];

          const { output: AIToolName } = await generateText({
            model: getModel(model),
            output: Output.choice({ options: enumOptions }),
            prompt,
          });

          writer.write({
            data: AIToolName as ToolName,
            type: 'data-toolName',
          });

          toolName = AIToolName;
        }

        const stream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: getModel(model),
          prompt: 'System: You are a helpful assistant. Provide clear and concise responses in Indonesian or English.',
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: getModel(model),
              writer,
            }),
            table: getTableTool(editor, {
              messagesRaw,
              model: getModel(model),
              writer,
            }),
          },
          prepareStep: async (step) => {
            if (toolName === 'comment') {
              return {
                ...step,
                toolChoice: { toolName: 'comment', type: 'tool' },
              };
            }

            if (toolName === 'edit') {
              const [editPrompt, editType] = getEditPrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              if (editType === 'table') {
                return {
                  ...step,
                  toolChoice: { toolName: 'table', type: 'tool' },
                };
              }

              return {
                ...step,
                activeTools: [],
                messages: [{ content: editPrompt, role: 'user' }],
              };
            }

            if (toolName === 'generate') {
              const generatePrompt = getGeneratePrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                messages: [{ content: generatePrompt, role: 'user' }],
              };
            }
          },
        });

        writer.merge(stream.toUIMessageStream({ sendFinish: false }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

const getCommentTool = (
  editor: any,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<any>;
  }
) =>
  tool({
    description: 'Comment on the content',
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const commentSchema = z.object({
        blockId: z.string(),
        comment: z.string(),
        content: z.string(),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: commentSchema }),
        prompt: getCommentPrompt(editor, {
          messages: messagesRaw,
        }),
      });

      let lastLength = 0;
      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const comment = partialArray[i];
          writer.write({
            id: nanoid(),
            data: { comment, status: 'streaming' },
            type: 'data-comment',
          });
        }
        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: { comment: null, status: 'finished' },
        type: 'data-comment',
      });
    },
  });

const getTableTool = (
  editor: any,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<any>;
  }
) =>
  tool({
    description: 'Edit table cells',
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const cellUpdateSchema = z.object({
        content: z.string(),
        id: z.string(),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: cellUpdateSchema }),
        prompt: buildEditTableMultiCellPrompt(editor, messagesRaw),
      });

      let lastLength = 0;
      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const cellUpdate = partialArray[i];
          writer.write({
            id: nanoid(),
            data: { cellUpdate, status: 'streaming' },
            type: 'data-table',
          });
        }
        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: { cellUpdate: null, status: 'finished' },
        type: 'data-table',
      });
    },
  });