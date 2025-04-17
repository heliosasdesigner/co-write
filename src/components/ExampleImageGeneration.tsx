import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { useImageRequest } from "../hooks/useImageRequest";

const ExampleImageGeneration = () => {
  const [draftPrompt, setDraftPrompt] = useState<string>("");
  const { imageUrl, isLoading, error, setImagePrompt } = useImageRequest();

  function handleSubmit() {
    setImagePrompt(draftPrompt);
  }

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
