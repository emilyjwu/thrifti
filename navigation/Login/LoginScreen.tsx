import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import Toast from "react-native-toast-message";
import { AuthContext, auth } from "../../database/index";

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp }) => {
  const [email, setEmail] = useState("e@w.com");
  const [password, setPassword] = useState("aaaaaa");
  const { setAuthAfterLogin } = useContext(AuthContext);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successful Signin
        // ******************** ******************** EMAIL VERIFIED CHECK ******************** ********************
        /*
        if (!userCredential.user.emailVerified) {
          console.log("NO!");
          Toast.show({
            type: "info",
            text1: "You must verify you email.",
          });
          signOut(getAuth());
          return;
        }
        */
        console.log("Email: ", email);
        console.log("Password: ", password);
        console.log("UID: ", userCredential.user.uid);
        setAuthAfterLogin(userCredential.user);
        onLogin(email);
      })
      .catch((error) => {
        console.log("Login Issue");
        setEmail("");
        setPassword("");
        Toast.show({
          type: "info",
          text1: "Incorrect Email or Password",
        });
        return;
      });
  };

  const handleSignUp = async () => {
    onSignUp();
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <Button title="Login" onPress={handleLogin} />
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

export default LoginScreen;
