import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Chatbot components
import ChatbotFAB from '../../utils/ChatbotFAB';
import ChatbotOverlay from '../../utils/ChatbotOverlay';

const CardsPage = ({ route }) => {
  const { chapterTitle, chapterContent, fullData, chapterIndex, courseId } = route.params;

  const quizId = `${courseId}_quiz_${chapterIndex}`;
  console.log('Derived quizId:', quizId);

  const navigation = useNavigation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);
  const chatbotRef = useRef(null);

  // Send chapter context to chatbot
  useEffect(() => {
    if (fullData) {
      const interval = setInterval(() => {
        if (chatbotRef.current) {
          const chaptersList = fullData.chapters
            ?.map((ch, i) => `Chapter ${i + 1}: ${ch.title}`)
            .join('\n');

          const context = `Course ID: ${courseId}
Chapter: ${chapterTitle}
Available Chapters:\n${chaptersList}`;

          chatbotRef.current.addCourseContext(context);
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [fullData]);

  const nextCard = () => {
    if (currentCardIndex < chapterContent.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex === 0) {
      navigation.goBack();
    } else {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const currentQuiz = fullData.chapters[chapterIndex]?.quiz;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{chapterTitle}</Text>
      <ScrollView 
        style={styles.cardsContainer} 
        contentContainerStyle={styles.cardsContentContainer}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {chapterContent[currentCardIndex].title}
          </Text>
          <Text style={styles.cardContent}>
            {chapterContent[currentCardIndex].data}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={previousCard}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (currentCardIndex === chapterContent.length - 1) {
              navigation.navigate('QuizPage', {
                questions: currentQuiz?.questions,
                courseId: courseId,
                quizId: quizId,
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

      {/* Chatbot */}
      <ChatbotFAB onPress={() => setChatVisible(true)} />
      <ChatbotOverlay
        ref={chatbotRef}
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
      />
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
