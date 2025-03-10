// E:\Blockchain project\EduX\src\screens/CardsPage.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CardsPage = ({ route }) => {
  // Destructure passed data from CourseContent
  // Note: Use 'courseId' (lowercase) to match what was passed
  const { chapterTitle, chapterContent, fullData, chapterIndex, courseId } = route.params;
  
  // Derive a unique quiz ID based on courseId and chapterIndex
  const quizId = `${courseId}_quiz_${chapterIndex}`;
  console.log('Derived quizId:', quizId);

  const navigation = useNavigation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Move to the next card
  const nextCard = () => {
    if (currentCardIndex < chapterContent.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  // Move to the previous card or go back if at the first card
  const previousCard = () => {
    if (currentCardIndex === 0) {
      navigation.goBack();
    } else {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Access the quiz for the current chapter using the chapterIndex
  const currentQuiz = fullData.chapters[chapterIndex]?.quiz;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{chapterTitle}</Text>
      <ScrollView 
        style={styles.cardsContainer} 
        contentContainerStyle={styles.cardsContentContainer}
      >
        {/* Display only the current card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {chapterContent[currentCardIndex].title}
          </Text>
          <Text style={styles.cardContent}>
            {chapterContent[currentCardIndex].data}
          </Text>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={previousCard}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // If it's the last card, navigate to QuizPage with the quiz details
            if (currentCardIndex === chapterContent.length - 1) {
              navigation.navigate('QuizPage', {
                questions: currentQuiz?.questions,
                courseId: courseId,  // Pass the course ID correctly
                quizId: quizId,      // Pass the derived quiz ID
              });
            } else {
              nextCard();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {currentCardIndex === chapterContent.length - 1 ? 'End of Chapter' : 'Next'}
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
    fontSize: 34,
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
  // Apply layout properties here via contentContainerStyle
  cardsContentContainer: {
    flexGrow: 1,
  },
  card: {
    borderWidth: 3,
    borderRadius: 15,
    shadowColor: '#7979B2',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 9,
    borderColor: '#0E0325',
    backgroundColor: '#0E0325',
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: 'lightgrey',
    marginBottom: 30,
  },
  cardContent: {
    fontSize: 20,
    color: 'grey',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginHorizontal: 15,
  },
  button: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#7979B2',
    padding: 12,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    fontSize: 18,
    color: 'darkpurple',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});

export default CardsPage;
