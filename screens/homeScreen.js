import React, { useState } from "react";
import {View,StyleSheet,Text, ScrollView, Button} from "react-native";
import SearchBar from "../components/SearchBar";
import TaskOne from "../components/TaskOne";
import TaskTwo from "../components/TaskTwo";

function HomeScreen() {
    const [searchText, setSearchText] = useState("");
    return (
        <View style={styles.container}>
            <View style ={styles.Button}>
            <Button title="post task"></Button>
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
        paddingLeft: 100,
        paddingRight: 100,

    }
    
})