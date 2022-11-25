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
    const [taskDetails, setTaskDetails] = useState("");

    return(
        <View style={styles.container}>
            <Text style={styles.title}>post Task</Text>
            <View style={styles.task}>
                <Text>Tell us more about what are you looking for.</Text>
                    <TextInput
                    style={styles.taskDetails}
                    placeholder="  taskDetails"
                    placeholderTextColor={'#3c3744'}
                    onChangeText={(taskDetails) => setuserName(setTaskDetails)}
                    />
            </View>
        </View>


    )


}

export default Post;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"#F3F3F3",
        alignItems: 'center',
        
 
    },
    title:{
        flex:1,
        fontSize: 20
    },
    task:{
        flex:3
    },
    taskDetails:{
        backgroundColor: "white",
        paddingTop:3,
        marginTop:10,
        paddingBottom:80
    }
    // title:{
    //     padding:20,
    //     fontSize: 25,
    //     //fontFamily:"Cochin",
    //     marginBottom:50

    // }
    
});
