import React,{useEffect} from "react";
import Navigation from "./src/navigation/navigation"; // Correct path to navigation.jsx
import analytics from "@react-native-firebase/analytics";
import firestore from "@react-native-firebase/firestore";

const App = () => {
  return <Navigation />;
};

export default App;

