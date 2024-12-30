import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Correct import for HomeScreen from the 'screens' folder
import HomeScreen from "../screens/homescreen"; // Use relative path to navigate to 'screens'
import Login from "../screens/login";
import SignUp from "../screens/signup"
import Dashboard from "../screens/dashboard"
import Course1 from "../screens/courseContent/course1"

const Stack = createStackNavigator();

export default function Navigation() {
    console.log("navigation component rendering")
    return (
        <NavigationContainer>
            {console.log("Inside NavigationContainer")}
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                {console.log("Inside stack.navigator")}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name ="Signup" component={SignUp}/>
                <Stack.Screen name="Dashboard" component={Dashboard}/>
                <Stack.Screen name="Course1" component={Course1}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
