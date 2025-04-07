// E:\Blockchain project\EduX\src\screens/CourseContent.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
// Import the chatbot components
import ChatbotFAB from '../../utils/ChatbotFAB';
import ChatbotOverlay from '../../utils/ChatbotOverlay';

const CourseContent = ({ route, navigation }) => {
  // Destructure courseId and (optionally) courseData from route.params
  const { courseData: passedCourseData, courseId } = route.params;
  const [courseData, setCourseData] = useState(passedCourseData);
  const [loading, setLoading] = useState(!passedCourseData);
  const [chatVisible, setChatVisible] = useState(false); // State to control chatbot overlay
  const chatbotRef = useRef(null); // Add a ref for the ChatbotOverlay

  // If courseData was not passed, fetch it using courseId
  useEffect(() => {
    if (!courseData) {
      firestore()
        .collection('courses')
        .doc(courseId)
        .get()
        .then(doc => {
          if (doc.exists) {
            setCourseData(doc.data());
          }
        })
        .catch(error => {
          console.error("Error fetching course data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [courseId, courseData]);

  // Add useEffect to add course context to chatbot when courseData is loaded
  useEffect(() => {
    if (courseData) {
      const interval = setInterval(() => {
        if (chatbotRef.current) {
          const chaptersList = courseData.contents?.chapters
            ?.map((ch, i) => `Chapter ${i + 1}: ${ch.title}`)
            .join('\n');
  
          const courseContext = `Course Title: ${courseData.title || 'Unknown'}
  Description: ${courseData.description || 'No description'}
  Chapters:\n${chaptersList || 'No chapters available'}`;
  
          chatbotRef.current.addCourseContext(courseContext);
          clearInterval(interval); // Cleanup after sending
        }
      }, 200); // Check every 200ms
  
      return () => clearInterval(interval); // Clean up on unmount
    }
  }, [courseData]);
  

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "lightgrey" }}>Loading course data...</Text>
      </View>
    );
  }

  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text>No course data available.</Text>
      </View>
    );
  }

  const { chapters } = courseData.contents; // Access chapters from courseData

  // Render each chapter title
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('cardsPage', {
          fullData: courseData.contents, // Passing full content data
          chapterTitle: item.title,
          chapterContent: item.content,
          chapterIndex: index,
          courseId: courseId,
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Image
          source={require('../../../src/assets/dashboard/backbutton.png')}
          style={styles.backButton}
          resizeMode="contain"
          aspectRatio={1}
        />
      </TouchableOpacity>
      
      <Image
        source={require('../../../src/assets/dashboard/coursefirst.png')}
        style={styles.coursefirst}
        resizeMode="contain"
      />
      <Text style={styles.title}>Course Content</Text>
      <FlatList
        data={chapters}
        renderItem={renderItem}
        keyExtractor={(item) => (item.id ? item.id.toString() : item.title)}
      />

      {/* Chatbot Floating Action Button (bottom left) */}
      <ChatbotFAB onPress={() => setChatVisible(true)} />

      {/* Chatbot Overlay Modal - Added ref */}
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
  card: {
    backgroundColor: '#0E0325',
    padding: 16,
    borderWidth: 2,
    borderRadius: 15,
    shadowColor: '#7979B2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 8,
    borderColor: '#7979B2',
    paddingTop: 35,
    paddingBottom: 35,
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  coursefirst: {
    width: '100%',
    marginBottom: '-29%',
    marginTop: '-15%',
  },
  backButton: {
    position: 'absolute',
    zIndex: 1,
    top: '3.5%',
    left: '5%',
    width: 40,
    height: 40,
  },
});

export default CourseContent;