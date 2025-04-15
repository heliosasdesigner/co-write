import OpenAI from "openai";
import Constants from "expo-constants";

const { OPENROUTER_API_KEY, OPENAI_API_KEY } =
  Constants.expoConfig?.extra || {};

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "X-Title": "Co-Write App",
  },
});
export const chatWithLLM = async (prompt: string): Promise<string> => {
  console.log("chatWithLLM called with prompt:", prompt);
  const completion = await client.chat.completions.create({
    model: "meta-llama/llama-4-maverick:free",
    messages: [
      {
        role: "user",

        content: "What is the meaning of life?",
      },
    ],
  });

  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content || "";
};

export async function streamWithFetch(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  //console.log("streamWithFetch called with prompt:", prompt);
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "",

        "X-Title": "",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-maverick:free",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    }
  );
  //console.log("!!!response from streamWithFetch :", response);
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lineEnd;
      while ((lineEnd = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);

        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content); // update state with the new content
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }
  } finally {
    reader.cancel();
  }
}
