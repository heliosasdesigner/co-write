import OpenAI from "openai";
import Constants from "expo-constants";

const { OPENROUTER_API_KEY, OPENAI_API_KEY } =
  Constants.expoConfig?.extra || {};

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

// Create a client for Openrouter
const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "X-Title": "Co-Write App",
  },
});

// Create a client for OpenAI
const openAIClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Use OpenAI's built-in type for chat messages
type AIResponse = OpenAI.ChatCompletionMessageParam;

// Response from API (non streaming)
export const chatWithLLM = async (
  prompt: AIResponse[],
  useOpenAI: boolean = false
): Promise<string> => {
  console.log("chatWithLLM called with prompt:", prompt);
  console.log("Using API:", useOpenAI ? "OpenAI" : "OpenRouter");

  try {
    const client = useOpenAI ? openAIClient : openRouterClient;
    const model = useOpenAI
      ? "gpt-4o-mini"
      : "meta-llama/llama-4-maverick:free";

    const completion = await client.chat.completions.create({
      model,
      messages: prompt,
      temperature: 0.7,
      max_tokens: useOpenAI ? 5000 : undefined, // 5000 tokens is the maximum for OpenAI
    });

    const response = completion.choices[0].message.content;
    console.log("API Response:", response);
    return response || "";
  } catch (error: any) {
    console.log("API Error:", error);
    if (useOpenAI) {
      console.log("Falling back to OpenRouter...");
      return chatWithLLM(prompt, false);
    }
    throw error;
  }
};
