import type { NextRequest } from "next/server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { environments } from "@/app/environments";

export async function POST(req: NextRequest) {
  const { prompt, system } = await req.json();

  const apiKey = environments.GOOGLE_GENERATIVE_AI;
  const model = environments.GOOGLE_GENERATIVE_AI_MODEL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key." },
      { status: 401 },
    );
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey });

    const actualModelId = model.includes("/") ? model.split("/")[1] : model;

    const result = await generateText({
      abortSignal: req.signal,
      maxOutputTokens: 100,
      model: google(actualModelId),
      prompt,
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(null, { status: 408 });
    }

    console.error("[GOOGLE_GENERATE_ERROR]:", error);

    return NextResponse.json(
      { error: "Internal server error", message: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
