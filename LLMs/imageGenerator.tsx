import OpenAI from "openai";
import Constants from "expo-constants";

// Get OpenAI API key from Expo config
const { OPENAI_API_KEY } = Constants.expoConfig?.extra || {};

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

export const generateImage = async (prompt: string) => {
  console.log("generateImage called with prompt:", prompt);
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  return response.data[0].url;
};
