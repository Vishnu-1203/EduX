import React,{useState} from "react";
import {View,Text,Button,StyleSheet,TouchableOpacity} from "react-native"
import Profile from "./dashboardComponents/profile"
import Courses from "./dashboardComponents/courses"
import Settings from "./dashboardComponents/settings"
import {handleLogout} from "../utils/loginfunctions"

export default function Dashboard({navigation}){
    const [component,setComponent]=useState(<Profile/>)

    return (<View style={{flex:1}}><View style={styles.container}>
        <Text>Dashboard</Text>

        <Button title="Log Out" onPress={()=>{handleLogout(navigation)}}/>
        {component}
        </View>
        <View style={styles.bottomNavbar}>
            <TouchableOpacity onPress={()=>{setComponent(<Courses/>)}}><Text>Courses</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{setComponent(<Profile/>)}}><Text>Profile</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{setComponent(<Settings/>)}}><Text>Settings</Text></TouchableOpacity>

        </View >
        </View>
        )
    };
const styles=StyleSheet.create({
    container:{
        flex:15
         },
    bottomNavbar:{
        flex:2,
        border:10,
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        backgroundColor:"grey",


        flexDirection:"row",
        justifyContent:"space-around"

        }

    })