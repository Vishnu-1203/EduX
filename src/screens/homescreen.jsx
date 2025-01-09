import React, { useRef } from "react";
import { Animated, View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start(() => {
            navigation.navigate("Login");
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>E D U C H A I N</Text>
                <Text style={styles.subtitle}>Learn and Earn</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Animated.View style={[styles.customButton, { transform: [{ scale }] }]}>
                        <Text style={styles.customButtonText}>GET STARTED</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
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
        fontSize: 50,
        fontWeight: "bold",
        color: "black",
    },
    subtitle: {

        fontSize: 22,

        fontSize: 20,
        color: "#A5A5A5",
        textAlign: "center",
        marginVertical: 10,

    },
    buttonContainer: {
        width: "80%",
        marginTop: 20,
    },
    customButton: {
        width: "100%",
        paddingVertical: 15,
        backgroundColor: "#1DFF80",
        borderRadius: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    customButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
});
