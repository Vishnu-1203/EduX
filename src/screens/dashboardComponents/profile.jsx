import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import auth from "@react-native-firebase/auth";

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const { displayName, photoURL, email } = currentUser;
            setUser({ name: displayName, image: photoURL, email });
        }
    }, []);

    return (
        <View style={styles.container}>
            {user ? (
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: user.image }}
                        style={styles.image}
                    />
                    <Text style={styles.infoText}>Name: {user.name}</Text>
                    <Text style={styles.infoText}>Email: {user.email}</Text>
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    profileCard: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 5,
        borderColor: "#ddd",
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 18,
        color: "#888",
    },
});
