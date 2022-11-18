import React, { useState } from "react";
import {View,StyleSheet,Text, ScrollView, Button, TouchableOpacity, Alert} from "react-native";
import SearchBar from "../components/SearchBar";
import TaskOne from "../components/TaskOne";
import TaskTwo from "../components/TaskTwo";
import Post from "./Post";
//import{ StackNavigator } from "react-navigation";
import Login from "./login";



function HomeScreen({ navigation }) {
    const [searchText, setSearchText] = useState("");
    const addTask = () => navigation.navigate('Post');
    return (
        <View style={styles.container}>
            <View >
            <TouchableOpacity style ={styles.Button} onPress={addTask}>
                <Text style={styles.addTask}>Post Task</Text>
            </TouchableOpacity>
            </View>
            <Text style={styles.header}>Home Screen</Text>
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
            <Text>{searchText}</Text>
            <Text style={styles.title}> Recent Tasks </Text>
           <ScrollView>
            <TaskOne />
            <TaskTwo/>
            </ScrollView>
        </View>
        
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        paddingTop: 50,
 
    },
    header:{
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    title:{
        fontWeight: "bold",
    },
    Button:{
        backgroundColor: "#E1F1E0",
        borderRadius: 25,
        width: 80,
        //paddingHorizontal :10,
    
        marginLeft: 10,
        mardinRight: 10,
        justifyContent: "center",
        alignContent: "center"

    },
    addTask:{

    }
    
});


