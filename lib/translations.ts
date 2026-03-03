import { environments } from "@/app/environments";
import { GoogleGenAI } from "@google/genai";
import * as deepl from "deepl-node";
import { normalizeNodeId, Value } from "platejs";

export const translates = {
  /**
   * Translate a Plate.js Value from one language to another using the Gemini
   * AI model.
   *
   * @param {Object} options - An object containing the following properties:
   *   - nodes (required): The Plate.js Value to translate.
   *   - lang (optional): The source language of the text to translate. Defaults to "English".
   *   - targetLang (required): The target language to translate the text to.
   *
   * @returns {Promise<Value | null>} - A Promise that resolves to the translated Value or null if an error occurs.
   * @throws {Error} - If the Gemini API does not return a response or if the response is invalid.
   */
  gemini: async ({
    nodes,
    sourceLang = "English",
    targetLang,
  }: {
    nodes: Value;
    sourceLang?: string;
    targetLang: string;
  }): Promise<Value | null> => {
    // Initialize the client
    const ai = new GoogleGenAI({
      apiKey: environments.GOOGLE_GENERATIVE_AI,
    });

    const MODEL = environments.GOOGLE_GENERATIVE_AI_MODEL;

    const TRANSLATION_PROMPT = `
    Translate the following JSON array of Plate.js nodes from ${sourceLang} to ${targetLang}
    
    STRICT INSTRUCTIONS:
    1. PROHIBITED: Do not change the JSON structure or keys. 
    2. SKIP: Do not translate any node with type "toc", "h1", "code_block", "code_line", or if it has "code": true.
    3. TARGET: Only translate strings within the "text" property.
    4. PRESERVE: Keep id, type, url, and children properties exactly as they are.
    5. OUTPUT: Return only the final translated JSON array.

    CONTENT TO TRANSLATE:
    ${JSON.stringify(nodes)}
  `;

    try {
      const result = await ai.models.generateContent({
        model: MODEL,
        contents: TRANSLATION_PROMPT,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = result.text;

      if (!responseText)
        throw new Error("No response received from Gemini API");

      const translatedNodes = JSON.parse(responseText) as Value;

      return normalizeNodeId(translatedNodes);
    } catch (error) {
      console.error("[GEMINI_TRANSLATION_ERROR]:", error);
      return null;
    }
  },
  /**
   * Translate a given text from one language to another using DeepL.
   * @param {Object} params - Parameters to pass to the DeepL translation API.
   * @param {string} params.texts - The text to translate.
   * @param {deepl.SourceLanguageCode} [params.sourceLang="en"] - The source language of the text.
   * @param {deepl.TargetLanguageCode} [params.targetLang="id"] - The target language of the text.
   * @returns {Promise<string>} - The translated text.
   */
  deepl: async ({
    texts,
    sourceLang = "en",
    targetLang = "id",
  }: {
    texts: string | string[];
    sourceLang?: deepl.SourceLanguageCode;
    targetLang?: deepl.TargetLanguageCode;
  }): Promise<string | deepl.TextResult[]> => {
    const context = "Professional, clean, and engaging tone.";

    try {
      const translator = new deepl.DeepLClient(environments.DEEPL_AUTH_KEY);
      const result = await translator.translateText(
        texts,
        sourceLang,
        targetLang,
        {
          formality: "prefer_more",
          modelType: "prefer_quality_optimized",
          context,
        },
      );

      if (Array.isArray(result)) return result;

      return result.text;
    } catch (error) {
      console.error("[DEEPL_TRANSLATION_ERROR]:", error);
      return "";
    }
  },
};
