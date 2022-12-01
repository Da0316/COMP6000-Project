import React from "react";
import { View,StyleSheet,Text,Image, TouchableOpacity } from "react-native";
import { useState } from "react";

const ViewJob = ({navigation}) => {
    const [jobID,setjobID] =useState('');
    const [jobTitle,setjobTilte] =useState('');
    const [jobDescription,setjobDescription] =useState('');
    const [price, setprice] =useState('');

    //fetch data for the job from the database
    //need to create an API for this

    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/postThumbnail.php', { //needs to be changed to your own ip
          method: 'post', 
          header: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            jobID: 1,
            job_Description: ""
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //sets the variables
            //console.log(responseJson);
            setjobID(responseJson[0]);
            setjobTilte(responseJson[1]);
            setjobDescription(responseJson[2]);
            setprice(responseJson[3]);
            
          })
          .catch((error) => {
            console.error(error);
          });
        
        const showJob = () => {
            navigation.navigate();
        }


    return(
        <TouchableOpacity onPress={showJob}>
        <View style={styles.container}>
            {/* image */}
            <Image source={{
                uri: "https://images.unsplash.com/photo-1531617494862-4e322fb560c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nJTIwd2Fsa2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
            }}
            style={styles.image}
            />
            <View style={{padding: 20}}>

            {/* title */}
            <Text style={styles.title}>{jobTitle}</Text>

            {/* description*/}
            <Text style={styles.description}>{jobDescription}</Text>
       
            {/* amount */}
            <Text style={styles.amount}>£{price}/h </Text>
            </View>
        </View>
        </TouchableOpacity>
    )
        }


export default ViewJob;

const styles = StyleSheet.create({ 
    container:{
        width:"90%",
        alignSelf: "center",
        borderRadius: 40,
        backgroundColor: "#EDF6F9",
        marginTop: 20
    },
    image:{
        height:200,
        width: "100%",
        borderTopLeftRadius:40,
        borderTopRightRadius:40

    },
    title:{
        fontSize:18,
        fontWeight:"600",
        marginTop: 10
    },
    description:{
        fontSize:14,
        fontWeight:"400",
        marginTop: 10
    },
    amount:{
        fontSize:14,
        alignSelf: 'flex-end',
        fontWeight: "bold",
        color:"#0077B6",
        marginTop:10
    }
})