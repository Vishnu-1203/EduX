import React from "react";
import {View,Text,Button} from "react-native";
export default function Course1({navigation}){
    return (<View><Text style={{fontSize:25}}>Course 1 Content, Godamnnit yall do something imma not even add this aswell pls</Text><Button title="back" onPress={()=>navigation.goBack()}/></View>)


    }