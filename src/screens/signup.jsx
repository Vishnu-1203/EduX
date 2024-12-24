import React,{useState} from "react";
import {Text,TextView,Button,View,StyleSheet,TextInput} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";


export default function SignUp({navigation}){
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSignUp=async(username,email,password)=>{
        console.log("entered handleSignup")
        if(!username|| !password || !email){
            setError("all fields required");
            return;
            }
        try{
        const userCredentials=await auth().createUserWithEmailAndPassword(email,password);
        console.log(userCredentials);
        const uid=userCredentials.user.uid

        await firestore().collection("users").doc(uid).set({
            username:username,
            email:email
            })

        console.log("end of handleSignUp")
            }
        catch(err){
            console.log(err,"this error cant signup")}
        }

    return (<View style={styles.container}>
        <Text style={{marginBottom:"20%",marginTop:"20%"}}>SignUp!!!!!</Text>
        <TextInput placeholder="Enter Username" style={styles.input} onChangeText={setUsername} value={username}></TextInput>
        <TextInput placeholder="Enter Email" style={styles.input} onChangeText={setEmail} value={email}></TextInput>
        <TextInput placeholder="Enter Password" style={styles.input} onChangeText={setPassword} value={password}></TextInput>
        <Button title="Sign Up!" onPress={()=>{handleSignUp(username,email,password)}}/>
        <Button title="Back" onPress={()=>{navigation.goBack()}}/>
            </View>)



    };

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center"
        },
    input:{
            fontSize:20,
            alignSelf:"center",
            backgroundColor:"grey",
            marginBottom:20,
            height:60,
            width:480,
            borderColor:"black",
            borderWidth:5
            }


    })