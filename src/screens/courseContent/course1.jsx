import React, {useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutCourse = ({route, navigation}) => {
  const [isJoining, setIsJoining] = useState(false); // State for join button
  const {courseId} = route.params; // Assume courseId is passed from navigation
  console.log('entered course 1 file');
  // Fetch course details from Firestore
  const fetchCourseDetails = async () => {
    try {
      const courseDoc = await firestore()
        .collection('courses')
        .doc(courseId)
        .get();
      if (courseDoc.exists) {
        return courseDoc.data(); // Return course data
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
    console.log('enter join course:');
    const user = auth().currentUser;

    setIsJoining(true);

    if (!user) {
      console.error('No user logged in!');
      setIsJoining(false);
      return;
    }

    try {
      // Add user to "joined courses"
      const userDocRef = firestore().collection('users').doc(user.uid);
      const userDocSnap = await userDocRef.get();

      const username = user.displayName || user.email.split('@')[0]; // Fallback to "email"
      const email = user.email || 'No Email Provided'; // Ensure email is handled properly
      if (!userDocSnap.exists) {
        // If user doesn't exist, create their document
        await userDocRef.set({
          username: username,
          email: email,
          joinedCourses: [courseId], // Add the course ID
        });
      } else {
        // Update user's joined courses
        const userData = userDocSnap.data();
        console.log('User data:', userData);
        console.log('Joined courses:', userData.joinedCourses);
        const updatedCourses = userData.joinedCourses
          ? [...new Set([...userData.joinedCourses, courseId])] // Avoid duplicates
          : [courseId];
        console.log('in else of userdocsnap beofer update', userData);

        await userDocRef.update({joinedCourses: updatedCourses});
        console.log('in else of userdocsnap', userData);
      }

      // Fetch course content
      const courseData = await fetchCourseDetails();
      if (courseData) {
        // Navigate to the course content page
        await AsyncStorage.setItem('UI/UX', JSON.stringify(courseData));

        navigation.navigate('CourseContent', {courseData});
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
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../src/assets/dashboard/backbutton.png')}
          style={styles.backButton}
          resizeMode="contain"
          aspectratio={1}
        />
      </TouchableOpacity>
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
    color: '#8031A7',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: 'lightgrey',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: '3.5%',
    left: '5%',
    width: 40,
    height: 40,
  },
});

export default AboutCourse;
