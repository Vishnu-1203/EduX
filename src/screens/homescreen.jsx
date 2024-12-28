import React,{useEffect} from 'react';
import { View, Text,Button,StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
export default function HomeScreen({ navigation }) {
    console.log("homescreen being called")
    const user=auth().currentUser;
    console.log("current user is:",user)
    if(user){
        const idToken=auth().currentUser.getIdToken(true);
        console.log("id Token",idToken);
        navigation.navigate("Dashboard");
        }
    return (
        <View style={styles.container}>
            <View style={{marginTop:"10%"}}></View>
            <Button title="login" onPress={()=>navigation.navigate("Login")}/>
            <Text style={styles.heading}>Heyyy Bro!  You are in the HomePage</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1
        },
    heading:{
        marginTop:"50%",
        fontSize:20,
        alignSelf:"center"

        }
    })