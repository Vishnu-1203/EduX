import React from "react";
import {View,Text,Button} from "react-native"

export default function Dashboard({navigation}){


    return (<View><Text>Dashboard</Text>

        <Button title="Homepage" onPress={()=>{navigation.navigate("Home");}}/>
        </View>


        )
    };