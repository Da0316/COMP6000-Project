import React, { useState } from "react";
import {useEffect} from "react";
import {View,StyleSheet,Text, ScrollView, Button, TouchableOpacity, Alert} from "react-native";
import SearchBar from "../components/SearchBar";
import ViewJob from "../components/ViewJob";
import { SelectList } from "react-native-dropdown-select-list";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import{ StackNavigator } from "react-navigation";

const SearchScreen =({ navigation, route })=> {
    
    const query = route.params;
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState([]);
    const [filterChoices, setFilterChoices] = useState([{key:'1', value:'Most relevant'},
    {key:'2', value:'Price: Low to High'},
    {key:'3', value:'Price: High to Low'},
    {key:'4', value:'Newest'},
    {key:'5', value:'Oldest'}]);
    const [fetched, setFetched] = useState(true);
  
    useEffect(() => {
        if (fetched){
          initalFetch();
        }
        
        const sortJobs = () => {
          //console#
          var array = [{id: "1", date: "2023-02-23"},
                        {id: "2", date: "Mon Feb  6 17:51:00 2023"}];
          switch(filter) {
            case 'Price: Low to High':
              setJobs(jobs.sort((a, b) => a.price - b.price));
              console.log(filter);
              //console.log(Date(jobs[2].date).getTime);
              break;
              
            case 'Price: High to Low':
              setJobs(jobs.sort((a, b) => b.price - a.price));
              console.log(filter);
              break;
            case 'Newest':
              setJobs(jobs.sort((a, b) => new Date(b.date) - new Date(a.date)));
              console.log(new Date(jobs[0].date));
              console.log(new Date(array[1].date))
              console.log(filter);
              break;
            case 'Oldest':
              setJobs(jobs.sort((a, b) => new Date(a.date) - new Date(b.date)));
              console.log(filter);
              break;
            default:
              setJobs(jobs);
          }
          console.log(jobs);
          //setFilter(filter);
        };
          //setFilter(filter);
          sortJobs();
    }, [route, filter]);
    useEffect(() => {});
    const initalFetch = () => {
      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/search.php', {
            method: 'post',
            header: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              searchInput: query
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            const ids = [];
            //console.log(responseJson);
            for (let i = 0; i < responseJson.length; i++){
              const formatDateed = formatDate(responseJson[i].posted_date);
              let object = {
                id: responseJson[i].jobID,
                date: formatDateed,
                price: responseJson[i].price,
              }
              
              ids.push(object);
            }
            setJobs(ids);
            // console.log(jobs);
            // console.log();
            // setJobs(jobs.sort((a, b) => b.price - a.price));
            // console.log(jobs);
          })
          .catch((error) => {
            alert(error)
          })
          setFetched(false);
    }

    function formatDate(dateString) {
      const date = new Date(dateString.replace(/-/g, '/'));
      const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
      };
      return date.toLocaleString('en-US', options);
    }
    // useEffect(() => {
    //   const sortJobs = () => {
    //     //console#
    //     var array = [{id: "1", date: "2023-02-23"},
    //                   {id: "2", date: "Mon Feb  6 17:51:00 2023"}];
    //     switch(filter) {
    //       case 'Price: Low to High':
    //         setJobs(jobs.sort((a, b) => a.price - b.price));
    //         console.log(filter);
    //         //console.log(Date(jobs[2].date).getTime);
    //         break;
            
    //       case 'Price: High to Low':
    //         setJobs(jobs.sort((a, b) => b.price - a.price));
    //         console.log(filter);
    //         break;
    //       case 'Newest':
    //         setJobs(jobs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    //         console.log(new Date(jobs[0].date));
    //         console.log(new Date(array[1].date))
    //         console.log(filter);
    //         break;
    //       case 'Oldest':
    //         setJobs(jobs.sort((a, b) => new Date(a.date) - new Date(b.date)));
    //         console.log(filter);
    //         break;
    //       default:
    //         setJobs(jobs);
    //     }
    //     console.log(jobs);
    //   };
    // }, []);
    
        
    
    //console.log(jobsID[0]);
    return (
        <View style={styles.container}>
              <ScrollView>
                <Text style={styles.title}> Results for: "{query}" </Text>
                <SelectList
                  setSelected={(val) => setFilter(val)}
                  data={filterChoices}
                  save="value"
                  label="Categories"
                  onSelect={()=> handelFilter}
                  style={styles.sortBox}
                  boxStyles={{marginRight:10}}
                  
                  
                />

                  
                <ScrollView 
                style={styles.ScrollView}
                pagingEnabled={true}
                >
                  {jobs.map(object => {
                    return <ViewJob key ={object.id} ID={object.id}/>
                  })}
                </ScrollView>
                
              </ScrollView>
            
        </View>
        
    );
  
}

export default SearchScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",

    },
    searchContainer:{
      //flexDirection:"row",
      //flexGrow: 4,
      marginVertical:5,

      backgroundColor:"fff",
      //justifyContent:"space-between",

    },
    upperView:{
      width:'100%',
      height:'22%',
      backgroundColor:'#f9ce40',
      borderBottomRightRadius:45,
      borderBottomLeftRadius:45,
      elevation:10

    },bottomView:{
      width:'100%',
      height:'78%',
      marginBottom:20,

      

    }
    ,header:{
      justifyContent:"center",
      paddingLeft:20,
      fontSize:16,
      paddingVertical:5,
      paddingTop:8,
      //fontFamily:"sans-serif-medium"
    },
    sortBox:{
      flexGrow :1,
      alignSelf:"flex-end",
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
      margin:5,
      //fadingEdgeLength:10

    }
});


