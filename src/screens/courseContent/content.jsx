// E:\Blockchain project\EduX\src\screens/CourseContent.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CourseContent = ({ route, navigation }) => {
  // Destructure courseId and (optionally) courseData from route.params
  const { courseData: passedCourseData, courseId } = route.params;
  const [courseData, setCourseData] = useState(passedCourseData);
  const [loading, setLoading] = useState(!passedCourseData);

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
      <TouchableOpacity
        style={styles.backButton}
        // Navigate to the main page (Dashboard) instead of going back
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
