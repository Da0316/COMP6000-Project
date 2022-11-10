import { StatusBar } from "expo-status-bar";
import { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

const Post =({ navigation }) =>{
    return(
        <View style={styles.container}>
            <Text>post Task</Text>
        
        </View>

    )


}

export default Post;

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#fff",
        paddingTop: 20,
 
    }
    // title:{
    //     padding:20,
    //     fontSize: 25,
    //     //fontFamily:"Cochin",
    //     marginBottom:50

    // }
    
});
