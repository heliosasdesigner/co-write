import { useEffect, useState } from "react";
import { generateImage } from "../../LLMs/imageGenerator";

export const useImageRequest = () => {
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (imagePrompt === "") {
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    setError(null);
    setImageUrl("");

    const fetchImage = async () => {
      try {
        const imageUrl = await generateImage(imagePrompt);
        if (!isCancelled) {
          setImageUrl(imageUrl || "");
        }
      } catch (error) {
        if (!isCancelled) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
    return () => {
      isCancelled = true;
    };
  }, [imagePrompt]);

  return { imageUrl, isLoading, error, setImagePrompt };
};
