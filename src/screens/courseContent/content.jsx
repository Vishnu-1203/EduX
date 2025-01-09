import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from "react-native";

const CourseContent = ({ route, navigation }) => {
    console.log("its in contents paaaage?");
    const [courseData, setCourseData] = useState(null); // State for course data
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = await AsyncStorage.getItem("UI/UX");
                if (storedData) {
                    const parsedData = JSON.parse(storedData); // Parse the stored JSON
                    setCourseData(parsedData); // Update state with retrieved data
                } else {
                    console.log("No data found in AsyncStorage for 'UI/UX'");
                }
            } catch (error) {
                console.error("Error fetching or parsing AsyncStorage data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, []); // Runs only once after the component mounts

    // Show loading indicator while fetching data
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // Ensure courseData is available before proceeding
    if (!courseData) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No course data available.</Text>
            </View>
        );
    }

    const { chapters } = courseData.contents; // Access chapters from retrieved data

    // Render each chapter title
    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("cardsPage", {
                    fullData: courseData.contents, // Passing all chapters' data
                    chapterTitle: item.title,
                    chapterContent: item.content, // Passing the content of the chapter
                    chapterIndex: index, // Passing the index of the chapter
                })
            }
        >
            <Text style={styles.chapterTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>UI/UX Course Content</Text>
            
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Dashboard")} // Goes back to the previous screen
            >
                <Text style={styles.backButtonText}>Back to Courses</Text>
            </TouchableOpacity>

            <FlatList
                data={chapters} // Rendering chapters
                renderItem={renderItem}
                keyExtractor={(item) => (item.id ? item.id.toString() : item.title)} // Ensure key is unique
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f4f4", // Lighter background color for a more pleasant look
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center", // Center the heading
    },
    loadingText: {
        fontSize: 18,
        color: "#555",
        textAlign: "center",
    },
    noDataText: {
        fontSize: 18,
        color: "#e74c3c", // Red color for error message
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff", // White background for each chapter card
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        elevation: 5, // Light shadow for card elevation
        shadowColor: "#000", // Add shadow for a floating effect
        shadowOffset: { width: 0, height: 4 }, // Adjust shadow position
        shadowOpacity: 0.2, // Adjust shadow opacity
        shadowRadius: 4, // Adjust shadow spread
    },
    chapterTitle: {
        fontSize: 18,
        fontWeight: "600", // Slightly lighter weight for better readability
        color: "#2c3e50", // Darker text color for better contrast
    },
    backButton: {
        backgroundColor: "#3498db", // Blue background color
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff", // White text color
    },
});

export default CourseContent;
