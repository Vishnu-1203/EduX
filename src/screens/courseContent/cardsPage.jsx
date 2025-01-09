import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const CardsPage = ({ route }) => {
    const { chapterTitle, chapterContent } = route.params; // Get chapter data passed from CourseContent
    const navigation = useNavigation(); // Get the navigation object

    // State to track the current card index
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Function to move to the next card
    const nextCard = () => {
        if (currentCardIndex < chapterContent.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1); // Increment index to show next card
        }
    };

    // Function to move to the previous card or go back to Chapters if it's the first card
    const previousCard = () => {
        if (currentCardIndex === 0) {
            navigation.goBack(); // Navigate back to the Chapters page if it's the first card
        } else {
            setCurrentCardIndex(currentCardIndex - 1); // Decrement index to show previous card
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{chapterTitle}</Text>
            <ScrollView style={styles.cardsContainer}>
                {/* Displaying only the current card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{chapterContent[currentCardIndex].title}</Text>
                    <Text style={styles.cardContent}>{chapterContent[currentCardIndex].data}</Text>
                </View>
            </ScrollView>

            {/* Buttons for navigating between cards */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={previousCard} // Now goes back to Chapters if it's the first card
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        // If it's the last card, go back to the Chapters page
                        if (currentCardIndex === chapterContent.length - 1) {
                            navigation.goBack(); // Navigate back to the previous screen (Chapters)
                        } else {
                            nextCard(); // Otherwise, move to the next card
                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {currentCardIndex === chapterContent.length - 1 ? "End of Chapter" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    sectionTitle: {
        fontSize: 34, // Increased font size for the chapter title
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    cardsContainer: {
        flex: 1,
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 27, // Increased font size for the card title
        fontWeight: "bold",
        marginBottom: 8,
    },
    cardContent: {
        fontSize: 20, // Increased font size for the card content
        color: "#555",
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: "45%", // Adjusted width for the buttons
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default CardsPage;
