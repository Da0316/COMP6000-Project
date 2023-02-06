import React, { useState } from "react";
import {useEffect} from "react";
import {View,StyleSheet,Text, ScrollView, Button, TouchableOpacity, Alert} from "react-native";
import SearchBar from "../components/SearchBar";
import ViewJob from "../components/ViewJob";
//import{ StackNavigator } from "react-navigation";

const HomeScreen =({ navigation })=> {
    const [searchText, setSearchText] = useState("");
    const [recentJobIDs, setRecentJobIDs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
  
    useEffect(() => {
     fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/jobsDate.php', { //needs to be changed to your own ip
          method: 'post', 
          header: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            id: global.userID,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            const ids = [];
            for (let i = 0; i < responseJson.length; i++){
              let object = {
                id: responseJson[i],
              }
              ids.push(object)
            }
            setRecentJobIDs(ids);
            setLoading(false);
          });
          
          // .catch((error) => {
          //   console.error(error);
          // });
          
    }, []);

    useEffect(() => {
      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/recommendedJobs.php', {
        method: 'post',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: global.userID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        const ids = [];
        for (let i = 0; i < responseJson.length; i++){
          let object = {
            id: responseJson[i],
          }
          ids.push(object);
        }
        setRecommendedJobs(ids);
      })
      .catch((error) => {
        alert(error)
      })
    })

        
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
            <ScrollView>
              <Text style={styles.title}> Recent Tasks </Text>
              <ScrollView horizontal ={true}>
                {recentJobIDs.map(object => {
                  return <ViewJob key ={object.id} ID={object.id}/>
                })}
              </ScrollView>
              <Text style={styles.title}>Recommended For You</Text>
              <ScrollView horizontal = {true}>
                {recommendedJobs.map(object => {
                  return <ViewJob key = {object.id} ID={object.id}/>
                })}
              </ScrollView>
            </ScrollView>
        </View>
        
    );
  
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",

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


