import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export default function Courses({ navigation }) {
    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.courseItem}
                    onPress={() => navigation.navigate("Course1")}
                >
                    <Text style={styles.courseText}>Course 1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.courseItem}>
                    <Text style={styles.courseText}>Course 2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.courseItem}>
                    <Text style={styles.courseText}>Course 3</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        padding: 20,
    },
    courseItem: {
        marginVertical: 35,
        backgroundColor: "#000",
        borderRadius: 40,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 140,
    },
    courseText: {
        fontSize: 22,
        color: "#fff",
    },
});
