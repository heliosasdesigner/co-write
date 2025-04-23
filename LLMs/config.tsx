import OpenAI from "openai";
import Constants from "expo-constants";

const { OPENROUTER_API_KEY, OPENAI_API_KEY } =
  Constants.expoConfig?.extra || {};

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

// Create a client for Openrouter by using openai official client
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "X-Title": "Co-Write App",
  },
});

type AIResponse = {
  role: string;
  content: string;
};

// Response from Openrouter API (non streaming)
export const chatWithLLM = async (prompt: AIResponse[]): Promise<string> => {
  console.log("chatWithLLM called with prompt:", prompt);
  const completion = await client.chat.completions.create({
    model: "meta-llama/llama-4-maverick:free",
    messages: prompt,
  });

  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content || "";
};
