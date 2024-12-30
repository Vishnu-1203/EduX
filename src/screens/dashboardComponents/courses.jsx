import React from "react";
import {View,Text,ScrollView,TouchableOpacity,StyleSheet} from "react-native";
export default function Courses({navigation}){
    return (<ScrollView style={{flex:1}} >
        <View style={styles.container}s>
        <TouchableOpacity style={styles.courses} onPress={()=>navigation.navigate("Course1")}>
            <Text style={styles.innerText}>Course 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courses}>
            <Text style={styles.innerText}>Course 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courses}>
            <Text style={styles.innerText}>Course 3</Text>
        </TouchableOpacity>
        </View>

        </ScrollView>)


    }
const styles=StyleSheet.create({
container:{},

courses:{
    margin:"2%",
    backgroundColor:"grey",
    borderRadius:20,
    height:150,
    justifyContent:"center",
    alignItems:"center"
},
innerText:{
    fontSize:25

}


})