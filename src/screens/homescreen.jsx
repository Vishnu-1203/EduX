import React from 'react';
import { View, Text,Button,StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
    console.log("homescreen being called")
    return (
        <View style={styles.container}>
            <View style={{marginTop:"10%"}}></View>
            <Button title="login" onPress={()=>navigation.navigate("Login")}/>
            <Text style={styles.heading}>Heyyy!  You are in the HomePage</Text>
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