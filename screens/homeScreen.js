import React, { useState } from "react";
import {useEffect} from "react";
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
    const [jobsID, setJobsID] = useState([]);
    const [id1, setId1] = useState('');
    const addTask = () => navigation.navigate('Post');
    const chatScreen = () => navigation.navigate('Chat')
    const job = () => navigation.navigate('Job')

    const [loading, setLoading] = useState(true);
    
  
    useEffect(() => {
    
     fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/jobsDate.php', { //needs to be changed to your own ip
          method: 'post', 
          header: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            
          }),
        })
          .then((response) => response.json())
          .then(jobsID => {
            setJobsID(jobsID)
            setLoading(false);
          });
          
          // .catch((error) => {
          //   console.error(error);
          // });
          
        }, []);

        
        if(loading){
          return <Text>Loading....</Text>;
        }
        
    
    //console.log(jobsID[0]);
    return (
        <View style={styles.container}>
            <View style ={styles.Button}>
            
            </View>
            <Text style={styles.header}>Home Screen</Text>
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
            <Text>{searchText}</Text>
            <Text style={styles.title}> Recent Tasks </Text>
           <ScrollView>
            <ViewJob ID={jobsID[0]}/>
            <ViewJob ID={jobsID[2]}/>
            <ViewJob ID={3}/>
            <ViewJob ID={6}/>
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


