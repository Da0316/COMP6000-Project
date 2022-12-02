import React, { useState } from "react";
import {View,StyleSheet,Text, ScrollView, Button, TouchableOpacity, Alert} from "react-native";
import SearchBar from "../components/SearchBar";
import TaskOne from "../components/TaskOne";
import TaskTwo from "../components/TaskTwo";
import ViewJob from "../components/ViewJob";
import Post from "./Post";
//import{ StackNavigator } from "react-navigation";
import Login from "./login";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen =({ navigation })=> {
    const [searchText, setSearchText] = useState("");
    const addTask = () => navigation.navigate('Post');
    const chatScreen = () => navigation.navigate('Chat')
    const job = () => navigation.navigate('Job')
    return (
        <View style={styles.container}>
            <View style ={styles.Button}>
            <TouchableOpacity style={styles.Button} onPress={addTask}>
                <Text style={styles.addTask}>Post Task</Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={job}>
                <Text>Job</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Home Screen</Text>
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
            <Text>{searchText}</Text>
            <Text style={styles.title}> Recent Tasks </Text>
           <ScrollView>
            <ViewJob/>
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
        backgroundColor: "green",
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


