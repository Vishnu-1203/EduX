import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const CourseContent = ({ route, navigation }) => {
    const { courseData } = route.params; // Accessing 'courseData' from params
    const { chapters } = courseData.contents; // Extracting 'chapters' from 'contents'

    console.log(chapters); // Debugging: Ensure data structure is correct

    // Render each chapter title
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("cardsPage", {
                    chapterTitle: item.title,
                    chapterContent: item.content, // Passing the content of the chapter
                })
            }
        >
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={chapters} // Rendering chapters
                renderItem={renderItem}
                keyExtractor={(item) => item.id ? item.id.toString() : item.title} // Ensure key is unique
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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
});

export default CourseContent;
