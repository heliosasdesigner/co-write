import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { useImageRequest } from "../hooks/useImageRequest";
import { uploadSectionImages } from "../../api/stories";

const ExampleImageGeneration = () => {
  const [draftPrompt, setDraftPrompt] = useState<string>("");
  const { imageUrl, isLoading, error, setImagePrompt } = useImageRequest();

  async function handleSubmit() {
    console.log(draftPrompt);
    setImagePrompt(draftPrompt);
  }

  useEffect(() => {
    if (!imageUrl) return;
    const storyId = "NIlJsOjsvhFEC6CSPJRO";
    console.log("handleImageUpload hit!!!");
    console.log(imageUrl);

    uploadSectionImages(imageUrl, storyId)
      .then((url) => {
        console.log("url", url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }, [imageUrl]);

  return (
    <View>
      <Text style={styles.title}>Image Generator:</Text>

      <TextInput
        value={draftPrompt}
        onChangeText={setDraftPrompt}
        style={{ borderWidth: 1, padding: 8, margin: 8 }}
      />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 40,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginVertical: 16,
    alignSelf: "center",
  },
});

export default ExampleImageGeneration;
