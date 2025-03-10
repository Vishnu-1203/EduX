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
import RewardScreen from "../screens/dashboardComponents/RewardScreen"; // Ensure this path is correct

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Course1" component={Course1} />
        <Stack.Screen name="CourseContent" component={CourseContent} />
        <Stack.Screen name="cardsPage" component={CardsPage} />
        <Stack.Screen name="QuizPage" component={QuizPage} />
        <Stack.Screen name="RewardScreen" component={RewardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
