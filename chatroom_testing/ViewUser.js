import React, {useEffect, useState} from 'react';
import {View,SafeAreaView,StyleSheet,ScrollView, TouchableOpacity, Image} from 'react-native';
import { Avatar,Title,Caption,Text, TouchableRipple, TextInput } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ViewUser({selectedUser, onBack}){
    const [userID, setUserID] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [phone_number, setPhone_number] = useState(null);
    const [selectedImageName, setSelectedImageName] = useState('2846608f-203f-49fe-82f6-844a3f485510.png');
    const [jobsCompleted, setJobsCompleted] = useState(null);
    const [score, setScore] = useState(null);

        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/chatViewUser.php', {
            method: 'post',
            header : {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                username: selectedUser.username,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            setUserID(responseJson);
        })
        if (userID != null){
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
            method: 'post',
            header : {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userID: userID,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            setFirstname(responseJson[2]);
            setLastname(responseJson[3]);
            setPhone_number(responseJson[7]);
            if(responseJson[8] != null){
                setSelectedImageName (responseJson[8]);
            }
        })
      }

    const [jobID, setJobID] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJobEmpty, setIsJobEmpty] = useState(false);
    
   useEffect(() => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobs.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: userID
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson == -1){
                setIsJobEmpty(true)
            } else {
                const ids = [];
                for (let i = 0; i < responseJson.length; i++){
                    let object = {
                        id: responseJson[i],
                    };
                    ids.push(object)
                };
                setJobID(ids);  
            }
            setIsLoading(false);
        })
        .catch((error) => {
            alert(error);
        });
    }, []);

    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateReviewScore.php', {
      method: 'post',
      header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         userID: userID,
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          setScore(responseJson);
       })
      .catch((error) => {
          alert(error);
      });

      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateJobsCompleted.php', {
      method: 'post',
      header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         userID: userID,
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          setJobsCompleted(responseJson);
       })
      .catch((error) => {
          alert(error);
      });

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={onBack}>
            <Image source={require('./assets/back.png')}/>
          </TouchableOpacity>
        </View>
          <View style={styles.userInfoSection}>
              <View style={{flexDirection:'row', marginTop: 15}}>
                  <Avatar.Image
                      source={{
                        uri: 'https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/'+ selectedImageName,
                      }}
                      size={90} />
                  <View style= {{marginLeft:20}}>
                      <Title style={[styles.title,{
                          marginTop:15,
                          marginBottom:5,
                      }]}>{firstname} {lastname}</Title>
                      <Caption style={styles.caption}>{selectedUser.username}</Caption>
                  </View>
              </View> 
          </View>

          <View style={styles.userInfoSection}>
              <View style={styles.row}>
              <Icon name="phone"color="#777777" size={20}/>
              <Text style={{color:"#777777", marginLeft:20}}>{phone_number}</Text>
              </View>
          <View style={styles.infoBoxWrapper}>
             <View style={[styles.infoBox, {
              borderRightColor: '#dddddd',
              borderRightWidth: 1
               }]}>
               <Title>Ratings Level</Title>
               <Caption>{score}</Caption>
            </View>
         <View style={styles.infoBox}>
          <Title>Jobs Completed</Title>
          <Caption>{jobsCompleted}</Caption>
         </View>
           </View>
          </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#F3F3F3",
      
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 25,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 60,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userBtnWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 10,
      marginTop:10,
    },
    userBtn: {
      borderColor: '#2e64e5',
      borderWidth: 2,
      borderRadius: 3,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginHorizontal: 5,
    },
    userBtnTxt: {
      color: '#2e64e5'
    },
  
    reviewForm:{
      backgroundColor: "white",
      paddingTop:3,
      marginTop:10,
      paddingBottom:60
    },
    actionBar: {
      backgroundColor: '#cacaca',
      height: 41,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });