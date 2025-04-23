import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { authStyles, loginButtonStyles } from "../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const backImage = require("../../assets/backImage.png");

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = async () => {
    if (email !== "" && password !== "") {
      try {
        await setPersistence(auth, inMemoryPersistence);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // ✅ Add/update user data in Firestore
        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogin: new Date(),
          },
          { merge: true }
        );

        console.log("Login success");
        Alert.alert("Success", "Logged in successfully!");
      } catch (error: unknown) {
        console.error("Login error:", error);
        Alert.alert(
          "Login error",
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    } else {
      Alert.alert("Missing Fields", "Please enter both email and password.");
    }
  };

  return (
    <View style={authStyles.container}>
      <Image source={backImage} style={authStyles.backImage} />
      <View style={authStyles.whiteSheet} />
      <SafeAreaView style={authStyles.form}>
        <Text style={authStyles.title}>Log In</Text>
        <TextInput
          style={authStyles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={authStyles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={loginButtonStyles.button}
          onPress={onHandleLogin}
        >
          <Text style={loginButtonStyles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <View style={authStyles.linkContainer}>
          <Text style={authStyles.linkText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={authStyles.linkButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
