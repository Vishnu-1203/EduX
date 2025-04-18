// E:\Blockchain project\EduX\src\screens\AboutCourse.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AboutCourse = ({ route, navigation }) => {
  const [isJoining, setIsJoining] = useState(false);
  const { courseId } = route.params; // Expecting courseId from navigation
  console.log('entered AboutCourse screen');

  // Fetch course details from Firestore
  const fetchCourseDetails = async () => {
    try {
      const courseDoc = await firestore()
        .collection('courses')
        .doc(courseId)
        .get();
      if (courseDoc.exists) {
        const courseData = courseDoc.data();
        console.log(courseData);
        if (courseData && courseData.contents) {
          return courseData;
        } else {
          console.log("Course data does not have 'contents' field.");
          return null;
        }
      } else {
        console.log('No such course document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      return null;
    }
  };

  // Handle Join Course Button
  const joinCourse = async () => {
    console.log('Entering join course...');
    const user = auth().currentUser;
    setIsJoining(true);

    if (!user) {
      console.error('No user logged in!');
      setIsJoining(false);
      return;
    }

    try {
      const userDocRef = firestore().collection('users').doc(user.uid);
      const userDocSnap = await userDocRef.get();

      const username = user.displayName || user.email.split('@')[0];
      const email = user.email || 'No Email Provided';

      if (!userDocSnap.exists) {
        // If user doesn't exist, create their document with reward initialized to 0
        await userDocRef.set({
          username: username,
          email: email,
          joinedCourses: [courseId],
          reward: 0,
        });
      } else {
        // Update user's joined courses and reward
        const userData = userDocSnap.data();
        console.log('User data:', userData);
        console.log('Joined courses:', userData.joinedCourses);

        const existingCourses = Array.isArray(userData.joinedCourses)
          ? userData.joinedCourses.filter(course => course !== undefined && course !== null)
          : [];
        const updatedCourses = [...new Set([...existingCourses, courseId])];
        const currentReward = typeof userData.reward === 'number' ? userData.reward : 0;
        console.log('Updating joinedCourses with:', updatedCourses, 'and reward:', currentReward);

        await userDocRef.update({
          joinedCourses: updatedCourses,
          reward: currentReward,
        });
      }

      // Fetch course content and pass it manually via navigation parameters
      const fetchedCourseData = await fetchCourseDetails();
      console.log(fetchedCourseData, "AboutCourse page");
      if (fetchedCourseData) {
        navigation.navigate('CourseContent', { courseData: fetchedCourseData, courseId });
      }
    } catch (error) {
      console.error('Error joining course:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Image
          source={require('../../../src/assets/dashboard/backbutton.png')}
          style={styles.backButton}
          resizeMode="contain"
          aspectratio={1}
        />
      </TouchableOpacity>
      <Image
        source={require('../../../src/assets/dashboard/coursefirst.png')}
        style={styles.coursefirst}
        resizeMode="contain"
      />
      <Text style={styles.title}>About the Course</Text>
      <Text style={styles.subtitle}>
        Explore the latest tools and technologies used in modern UI/UX design.
        This course covers industry-standard software such as Figma, Sketch,
        Adobe XD, and prototyping tools. Students will gain hands-on experience
        in designing for various platforms, including web, mobile, and emerging
        technologies.
      </Text>
      <Button
        color={'#7979B2'}
        title={isJoining ? 'Joining...' : 'Join Course'}
        onPress={joinCourse}
        disabled={isJoining}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0E0325',
  },
  title: {
    color: 'lightgrey',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    marginLeft: '-52%',
  },
  subtitle: {
    marginTop: '-3%',
    color: 'lightgrey',
    fontSize: 17.5,
    marginBottom: '70%',
  },
  backButton: {
    position: 'absolute',
    top: '3.5%',
    left: '5%',
    width: 40,
    height: 40,
  },
  coursefirst: {
    height: '23%',
    marginBottom: 24,
  },
});

export default AboutCourse;
