import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { auth } from "../../database/index";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";
import { doc, setDoc, collection } from "firebase/firestore";
import {
  firestore,
  storage,
  firebaseApp,
  AuthContext,
} from "../../database/index";

interface LoginScreenProps {
  onSignUp: () => void;
  onReturn: () => void;
}

const SignupScreen: React.FC<LoginScreenProps> = ({ onSignUp, onReturn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const currentDate = new Date();

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const myDocRef = doc(
          collection(firestore, "users"),
          userCredential.user.uid
        );
        setDoc(myDocRef, {
          userName: username,
          fullName: fullName,
          email: email,
          joinedDate:
            currentDate.getFullYear() +
            "-" +
            (currentDate.getMonth() + 1) +
            "-" +
            currentDate.getDate(),
          following: [],
          followers: [],
          likedListings: [],
          transactions: [],
          requestIDs: [],
          binIDs: [],
          listingIDs: [],
          bio: "",
          profilePicURL: "",
        });
        //I also need to add part of this data to userChats data
        const myDocRef2 = doc(
          collection(firestore, "userChats"),
          userCredential.user.uid
        );
        setDoc(myDocRef2, {
          displayName: username,
          profilePicURL: "",
        });
        onSignUp();
      })
      .catch((error) => {
        console.log("Sign Up Issue: " + error);
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
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
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
      <Button title="Return to Login" onPress={onReturn} />
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
