import React, { useState } from "react";
import {useEffect} from "react";
import {View,StyleSheet,Text, ScrollView, Button, TouchableOpacity, Modal, Pressable} from "react-native";
import SearchBar from "../components/SearchBar";
import ViewJob from "../components/ViewJob";
import * as Location from 'expo-location';
import {getDistance} from 'geolib';
import _ from 'lodash';

const HomeScreen = ({ navigation, route })=> {
    const [recentJobIDs, setRecentJobIDs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');  
    const [userLongAndLat, setUserLongAndLat] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [nearbyJobs, setNearbyJobs] = useState([]);
    const [radius, setRadius] = useState(1000);
    const [modalVisible, setModalVisible] = useState(false);
    const [noNearby, setNoNearby] = useState(null);

    const componentDidMount = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return true;
      } else {
        return false; 
      }
    }

    const getLocation = async (address) => {
      if (componentDidMount()) {
        let location = await Location.geocodeAsync(address);
        if (location.length > 0) {
          return location[0];
        } else {
          throw new Error('rip');
        }
      }
    }

    const calculateDistance = (lat, long) => {
      const dis = getDistance(
        {latitude: userLongAndLat.latitude, longitude: userLongAndLat.longitude},
        {latitude: lat, longitude: long},
      );
      return dis;
    };

    useEffect(() => {
      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
        method: 'post',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: global.userID,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        setUserAddress(responseJson[5]);

       
      })
      .catch((error) => {
        alert(error)
      })
    }, []);

    useEffect(() => {
      if (userAddress != null){
        getLocation(userAddress).then(location => {
          let object = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
          setUserLongAndLat(object);
        }).catch(error => {
          console.log(error);
        });
      }
    }, [userAddress])
    

    useEffect(() => {
      try {
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
                  id: responseJson[i].jobID,

                }
                if(responseJson[i].job_completed != 1){  
                  ids.push(object)
                }
            }
            setRecentJobIDs(ids);
            setLoading(false);
          });
        } catch {
          console.log("error")
        }
          
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
          if (responseJson[i + 1] != global.userID){
            let object = {
              id: responseJson[i],
            }
            if(responseJson[i].job_completed != 1){
              ids.push(object);
            }
          }
        }
        setRecommendedJobs(ids);
      })
      .catch((error) => {
        alert(error)
      })
    }, [])
    
    useEffect(() =>{
        if (userLongAndLat != null){
          setModalVisible(false);
          fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/nearbyJobs.php', {
          method: 'post',
          header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: global.userID,
          })
          })
          .then((response) => response.json())
          .then(async (responseJson) => {
            let ids = []
            let count = 0;
            for (let i = 0; i < responseJson.length; i += 2) {
              try {
                const location =  await getLocation(responseJson[i + 1]);
                if (location) {
                  let object = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }
                  const distance = calculateDistance(object.latitude, object.longitude);
                  if (distance < radius) {
                    count++
                    ids.push({
                      id: responseJson[i]
                    });
                  }
                }
              } catch {
                console.log("Lol");
              }
            }
            if (count == 0){
              setNoNearby(true);
            } else {
              setNoNearby(false);
            }
            setNearbyJobs(_.shuffle(ids));
          })
          .catch((error) => {
            alert(error)
            setLoading(false);
          })
        }
    }, [userLongAndLat, radius])

    const handelSearch = async () =>{
      navigation.navigate('SearchScreen', query);
    } 

    const convert = () => { 
      return radius / 1000;
    }

    const renderNearby = () => {
      if (noNearby == false){
        return (
          <ScrollView horizontal = {true}>
            {nearbyJobs.map(object => {
              return <ViewJob key = {object.id} ID={object.id}/>
            })}
          </ScrollView>
        );
      } else if (noNearby == true){
        return (
          <View>
            <Text style={styles.title}>No Jobs Nearby!</Text>
          </View>
        );
      }
    }

        
    if(loading){
      return <Text>Loading....</Text>;
    }

    return (
        <ScrollView style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setRadius(2000)}>
                  <Text style={styles.textStyle}>2 Km</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setRadius(5000)}>
                  <Text style={styles.textStyle}>5 Km</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setRadius(10000)}>
                  <Text style={styles.textStyle}>10 Km</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setRadius(25000)}>
                  <Text style={styles.textStyle}>25 Km</Text>
                </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonRemove]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.upperView}>
              <Text style={styles.header}><Text style={{fontWeight:"bold",fontSize:30,paddingHorizontal:5}}>Hi! </Text>
              Search up for tasks that you're good at!</Text>
              <View style= {styles.searchContainer}>
                <SearchBar searchText={query} setSearchText={setQuery} style={styles.searchBox} />
                <TouchableOpacity onPress={handelSearch}>
                  <Text style={styles.searchTxt}>Search</Text>
                </TouchableOpacity>
              </View>
          </View>
            <View style={styles.bottomView}>
              <ScrollView>
                <Text style={styles.title}> Recent Tasks </Text>
                <ScrollView horizontal ={true} pagingEnabled={true}>
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
                <View style={styles.nearbyViewContainer}>
                  <Text style={styles.title}>Nearby Your Stored Address: </Text>
                  <Pressable
                    style={styles.openButton}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textStyle}>{convert()} Km</Text>
                  </Pressable>
                </View>
                <View>{renderNearby()}</View>
              </ScrollView>
            </View>
        </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
    },
    searchContainer:{
      flexDirection:"row",
      marginVertical:10,
      backgroundColor:"fff",
      elevation:8
    },
    upperView:{
      width:'100%',
      height:'16%',

      backgroundColor:'#f9ce40',
      borderBottomRightRadius:45,
      borderBottomLeftRadius:45,
      elevation:10

    },bottomView:{
      width:'100%',
      height:'84%',
      marginBottom:20,
      marginTop:5
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
        fontSize: 20,
        paddingLeft:8
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
    searchTxt:{
      backgroundColor:"#1a1918",
      borderColor:"#1a1918",
      color:"white",
      marginRight:10,
      height:40,
      borderWidth: 2,
      //paddingHorizontal: 15,
      borderRadius: 15,
      paddingVertical:8,
      paddingHorizontal:5,
      textAlign:"center",
      elevation:8

    },
    buttonsView:{
      width:'90%',
      color:'#000',
      height:50,
      backgroundColor:'#fff',
      borderRadius:10,
      marginTop:20,
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20, 
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#f9ce40',
    },
    buttonRemove: {
      backGroundColor: 'black'
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    nearbyViewContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    openButton: {
      backgroundColor: "#f9ce40",
      borderRadius: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      alignSelf: 'flex-start',
    }
});


