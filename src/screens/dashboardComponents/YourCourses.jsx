import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const YourCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const user = auth().currentUser;
        if (!user) return;

        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        const joinedCourses = userData?.joinedCourses || [];

        console.log('Joined Courses:', joinedCourses);

        const fetchedCourses = await Promise.all(
          joinedCourses.map(async (courseId) => {
            try {
              const courseDoc = await firestore().collection('courses').doc(courseId).get();

              if (courseDoc.exists) {
                const data = courseDoc.data();
                const title = data?.contents?.title;

                if (title) {
                  return {
                    id: courseId,
                    title, // only include what's needed
                  };
                } else {
                  console.warn(`⚠️ Course ${courseId} is missing a title in contents.`);
                }
              } else {
                console.warn(`❌ No document found for ${courseId}`);
              }
            } catch (err) {
              console.error(`🔥 Error fetching course ${courseId}:`, err);
            }
            return null;
          })
        );

        const validCourses = fetchedCourses.filter(Boolean);
        setCourses(validCourses);
      } catch (error) {
        console.error('Error fetching user courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  const renderCourse = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CourseContent', {
          courseId: item.id,
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Your Courses</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : courses.length === 0 ? (
        <Text style={styles.emptyText}>You haven't enrolled in any courses yet.</Text>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0325',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1B0B4A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: '#7979B2',
    borderWidth: 1.5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyText: {
    color: 'grey',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default YourCourses;