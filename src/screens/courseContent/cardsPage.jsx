import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import the useNavigation hook

const CardsPage = ({route}) => {
  const {chapterTitle, chapterContent, fullData, chapterIndex} = route.params; // Get the chapter data and index passed from CourseContent
  const navigation = useNavigation(); // Get the navigation object
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

  // Access the quiz for the current chapter using the passed chapterIndex
  const currentQuiz = fullData.chapters[chapterIndex]?.quiz;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{chapterTitle}</Text>
      <ScrollView style={styles.cardsContainer}>
        {/* Displaying only the current card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {chapterContent[currentCardIndex].title}
          </Text>
          <Text style={styles.cardContent}>
            {chapterContent[currentCardIndex].data}
          </Text>
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
            // If it's the last card, go to the quiz for the current chapter
            if (currentCardIndex === chapterContent.length - 1) {
              navigation.navigate('QuizPage', {
                questions: currentQuiz?.questions,
              });
            } else {
              nextCard(); // Otherwise, move to the next card
            }
          }}>
          <Text style={styles.buttonText}>
            {currentCardIndex === chapterContent.length - 1
              ? 'End of Chapter'
              : 'Next'}
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
    backgroundColor: '#0E0325',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 34, // Increased font size for the chapter title
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 10,
    marginTop: 40,
  },
  cardsContainer: {
    flex: 1,
    marginBottom: 16,
    marginTop: 30,
  },
  card: {
    borderWidth: 3,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#7979B2',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 20,
    shadowRadius: 20,
    elevation: 9,
    borderWidth: 2,
    borderColor: '#0E0325',
    backgroundColor: '#0E0325',
    padding: 16,
    marginBottom: 12,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 27, // Increased font size for the card title
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'lightgrey',
    marginBottom: 30,
  },
  cardContent: {
    fontSize: 20, // Increased font size for the card content
    color: 'grey',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  button: {
    borderWidth: 3,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#7979B2',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#7979B2',
    backgroundColor: '#7979B2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Adjusted width for the buttons
  },
  buttonText: {
    fontSize: 18,
    color: 'darkpurple',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});

export default CardsPage;
