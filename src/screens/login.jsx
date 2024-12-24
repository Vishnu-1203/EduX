import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { handleLogin, googleLogin } from "../utils/loginfunctions";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId: "513657717163-p3tqd6cpreqmrcd19u6h13cfdma7n4dv.apps.googleusercontent.com",
});

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <Text style={{ flex: 0.2, alignSelf: "center", marginTop: "10%", fontSize: 20 }}>
        You’re in the login page
      </Text>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <TextInput
        placeholder="Enter email"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Enter password"
        style={styles.input}
        onChangeText={setPass}
        value={pass}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={() => handleLogin(username, pass, navigation, setError)}
      />
      <View style={{ marginBottom: 20, marginTop: "20%" }}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
      <Button title="Sign Up" onPress={() => navigation.navigate("Signup")} />
      <TouchableOpacity
        style={{ marginTop: "10%" }}
        onPress={() => googleLogin(navigation, setError)}
      >
        <Text>Google Sign-In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    fontSize: 20,
    alignSelf: "center",
    backgroundColor: "grey",
    marginBottom: 20,
    height: 60,
    width: 480,
    borderColor: "black",
    borderWidth: 5,
  },
  button: {
    borderColor: "black",
    borderWidth: 5,
    backgroundColor: "red",
    width: 100,
    height: 100,
  },
});

export default Login;
