import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { auth } from "../../database/index";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";
import { addDoc, collection } from "firebase/firestore";
import { AuthContext, firestore } from "../../database/index";

interface LoginScreenProps {
  onSignUp: () => void;
}

const SignupScreen: React.FC<LoginScreenProps> = ({ onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        addDoc(collection(firestore, "users"), {
          userName: username,
          userID: userCredential.user.uid,
        });
        onSignUp();
      })
      .catch((error) => {
        //const errorCode = error.code;
        //const errorMessage = error.message;
        console.log("Sign Up Issue");
        setEmail("");
        setPassword("");
        Toast.show({
          type: "info",
          text1: "Must be a valid email with a password.",
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Toast position="bottom" bottomOffset={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default SignupScreen;
