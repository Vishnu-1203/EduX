import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const CourseContent = ({ route }) => {
    const data = route.params.courseData.contents; // The data passed from navigation

    console.log(data); // Debugging: Ensure data structure is correct

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.heading}>{`Section ${item.id}`}</Text>
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 3,
    },
    heading: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#888",
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
});

export default CourseContent;
