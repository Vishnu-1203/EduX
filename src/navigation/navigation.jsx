import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import screens
import HomeScreen from "../screens/homescreen";
import Login from "../screens/login";
import SignUp from "../screens/signup";
import Dashboard from "../screens/dashboard";
import Course1 from "../screens/courseContent/course1";
import CourseContent from "../screens/courseContent/content";
import CardsPage from "../screens/courseContent/cardsPage";
import QuizPage from "../screens/courseContent/quiz";
import RewardScreen from "../screens/dashboardComponents/RewardScreen"; // Adjust the path if necessary
import YourCourses from "../screens/dashboardComponents/YourCourses"; // Adjust if you place it somewhere else

const Stack = createStackNavigator();

export default function Navigation() {
  console.log("navigation component rendering");
  return (
    <NavigationContainer>
      {console.log("Inside NavigationContainer")}
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {console.log("Inside stack.navigator")}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Course1" component={Course1} />
        <Stack.Screen name="CourseContent" component={CourseContent} />
        <Stack.Screen name="cardsPage" component={CardsPage} />
        <Stack.Screen name="QuizPage" component={QuizPage} />
        <Stack.Screen name="RewardScreen" component={RewardScreen} />
        <Stack.Screen name="YourCourses" component={YourCourses} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
