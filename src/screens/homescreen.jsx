import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";

export default function HomeScreen({ navigation }) {
    console.log("homescreen being called");
    const user = auth().currentUser;

    if (user) {
        const idToken = auth().currentUser.getIdToken(true);
        console.log("id Token", idToken);
        navigation.navigate("Dashboard");
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>E D U C H A I N</Text>
                <Text style={styles.subtitle}>Learn and Earn NFTs</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 18,
        color: "#555",
        textAlign: "center",
        marginVertical: 10,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    loginButton: {
        width: "80%",
        padding: 15,
        backgroundColor: "#007BFF",
        borderRadius: 25,
        alignItems: "center",
    },
    loginButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
