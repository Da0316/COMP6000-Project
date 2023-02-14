import React, { useState } from "react";
import {useEffect} from "react";
import {View,StyleSheet,Text, ScrollView, Button, TouchableOpacity, Alert} from "react-native";
import SearchBar from "../components/SearchBar";
import ViewJob from "../components/ViewJob";
import { SelectList } from "react-native-dropdown-select-list";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import{ StackNavigator } from "react-navigation";

const HomeScreen =({ navigation, route })=> {
    const [searchText, setSearchText] = useState("");
    const [recentJobIDs, setRecentJobIDs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Most relevant');
    const [filterChoices, setFilterChoices] = useState([{key:'1', value:'Most relevant'},
    {key:'2', value:'price low to high'},
    {key:'3', value:'price high to low'},
    {key:'4', value:'Newest'},
    {key:'5', value:'Oldest'}]);
    
  
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
           handelFilter = () =>{}
          
    }, [route]);

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
    }, [])

    handelSearch = async () =>{
      try{
        const res = await fetch('search.php');
        const jobs = await res.json();
      }catch{

      }
    }

        
        if(loading){
          return <Text>Loading....</Text>;
        }
        
    
    //console.log(jobsID[0]);
    return (
        <View style={styles.container}>
            <View style ={styles.Button}>
            
            </View>
            <Text style={styles.header}><Text style={{fontWeight:"bold",fontSize:25,paddingHorizontal:5}}>Hi! </Text>
Search up for tasks that you're good at !</Text>
            <View style= {styles.searchContainer}>
              <SearchBar searchText={searchText} setSearchText={setSearchText} style={styles.searchBox} />
              {/* <SelectList
                setSelected={(val) => setFilter(val)}
                data={filterChoices}
                save="value"
                label="Categories"
                onSelect={()=> handelFilter}
                style={styles.sortBox}
                boxStyles={{marginRight:10}}
                
              /> */}
            </View>
            <View>
           </View>

            <ScrollView>
              <Text style={styles.title}> Recent Tasks </Text>
              <ScrollView 
              style={styles.ScrollView}
              horizontal ={true}
              //alwaysBounceVertical={true}
              //showsHorizontalScrollIndicator={true}
              pagingEnabled={true}
              >
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
    searchContainer:{
      //flexDirection:"row",
      //flexGrow: 4,
      marginVertical:10
      //justifyContent:"space-between",

    },
    header:{
      justifyContent:"center",
      paddingLeft:20,
      fontSize:16,
      paddingVertical:5
        //marginLeft: 'auto',
        //marginRight: 'auto',
    },
    searchBox:{
      paddingHorizontal:50,
      //flexGrow:4,
      //paddingHorizontal:10
      //marginLeft
    },
    sortBox:{
      flexGrow :1,
      alignSelf:"flex-end",
      //marginLeft:5

    }

    ,title:{
        fontWeight: "bold",
        fontSize: 20
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
    items:{
      //backgroundColor:"blue"

    },
    ScrollView:{
      //backgroundColor:"fff",
      margin:5

    }
});


