import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (username, email, password) => {
    console.log("entered handleSignup");
    if (!username || !password || !email) {
      console.error("All fields are required");
      return;
    }
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
      console.log(userCredentials);
      const uid = userCredentials.user.uid;

      await firestore().collection("users").doc(uid).set({
        username: username,
        email: email,
      });

      console.log("end of handleSignUp");
    } catch (err) {
      console.log(err, "this error can't signup");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <View style={styles.signupBox}>
        <Text style={styles.signupTitle}>S I G N  U P</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => handleSignUp(username, email, password)}
        >
          <Text style={styles.signupButtonText}>S I G N  U P</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0325",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "lightgrey",
  },
  signupBox: {
    width: "80%",
    backgroundColor: "#0E0325",
    borderRadius: 15,
    shadowColor: "#1DFF80",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 20,
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  signupTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "lightgrey",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1DFF80",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
