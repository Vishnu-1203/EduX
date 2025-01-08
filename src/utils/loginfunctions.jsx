import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {Alert} from "react-native"
GoogleSignin.configure({
  webClientId: "513657717163-p3tqd6cpreqmrcd19u6h13cfdma7n4dv.apps.googleusercontent.com",
});

export const handleLogin = async (username, pass, navigation, setError) => {
  if (!username || !pass) {
    setError("Incomplete Form");
    return;
  }

  try {
    const userCredentials = await auth().signInWithEmailAndPassword(username, pass);
    const uid = userCredentials.user.uid;

    const userDoc = await firestore().collection("users").doc(uid).get();
    if (userDoc.exists) {
      console.log("User exists:", userDoc.data());
      navigation.navigate("Dashboard");
    } else {
      console.log("User does not exist in Firestore.");
    }
    Alert.alert("Login Successfull!")
  } catch (err) {
    setError(err.message);
    console.log("Login Error:", err);
  }
};

export const googleLogin = async (navigation, setError) => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();

   const idToken = signInResult.data.idToken;
    console.log('Google SignIn Result:', signInResult);

    if (!idToken) {
      throw new Error("No ID token found");
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userCredential = await auth().signInWithCredential(googleCredential);
    console.log("Google login success:", userCredential);
    navigation.navigate("Dashboard");
    Alert.alert("Login Successfull!")

  } catch (err) {
    setError("Google Login Failed: " + err.message);
    console.log("Google Login Error:", err);
  }
};

export const handleLogout=async(navigation)=>{
    try{
        await auth().signOut();
        console.log("signing out");
        navigation.navigate("Home")
        }catch(err){
            console.log("Error logging out:",err)

            }

    }