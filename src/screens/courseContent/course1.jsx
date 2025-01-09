import React, { useState,useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AboutCourse = ({ route, navigation }) => {
  const [isJoining, setIsJoining] = useState(false); // State for join button
  const { courseId } = route.params; // Assume courseId is passed from navigation
    console.log("entered course 1 file",courseId)
  
  // Fetch course details from Firestore
  const fetchCourseDetails = async () => {
    try {
      const courseDoc = await firestore().collection("courses").doc(courseId).get();
      if (courseDoc.exists) {
        const courseData = courseDoc.data();
        console.log(courseData)
        if (courseData && courseData.contents) {
          return courseData; // Ensure contents exists before returning
        } else {
          console.log("Course data does not have 'contents' field.");
          return null;
        }
      } else {
        console.log("No such course document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      return null;
    }
  };
  
  

  // Handle Join Course Button
  const joinCourse = async () => {
    console.log("enter join course:")
    const user = auth().currentUser;

    setIsJoining(true);

    if (!user) {
      console.error("No user logged in!");
      setIsJoining(false);
      return;
    }
    try {
      // Add user to "joined courses"
      const userDocRef = firestore().collection("users").doc(user.uid);
      const userDocSnap = await userDocRef.get();

      const username = user.displayName || user.email.split("@")[0]; // Fallback to "email"
      const email = user.email || "No Email Provided"; // Ensure email is handled properly
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
        console.log("User data:", userData);
console.log("Joined courses:", userData.joinedCourses);
        const updatedCourses = userData.joinedCourses
          ? [...new Set([...userData.joinedCourses, courseId])] // Avoid duplicates
          : [courseId];

        await userDocRef.update({ joinedCourses: updatedCourses });



      }

      // Fetch course content
      const courseData = await fetchCourseDetails();
      console.log(courseData,"course1 paaaage")
      if (courseData) {
        // Navigate to the course content page
        await AsyncStorage.setItem("UI/UX",JSON.stringify(courseData))

        navigation.navigate("CourseContent", { courseData });
      }
    } catch (error) {
      console.error("Error joining course:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About the Course</Text>
      <Text style={styles.subtitle}>
        Explore the latest tools and technologies used in modern UI/UX design. 
        This course covers industry-standard software such as Figma, Sketch, 
        Adobe XD, and prototyping tools. Students will gain hands-on experience 
        in designing for various platforms, including web, mobile, and emerging technologies.
      </Text>
      <Button
        title={isJoining ? "Joining..." : "Join Course"}
        onPress={joinCourse}
        disabled={isJoining}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
});

export default AboutCourse;
