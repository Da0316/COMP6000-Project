import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const ViewApplication = ({ID}) => {
    const [jobID, setJobID] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [userApplicationID, setUserApplicationID] = useState('');
    const [statusNum, setStatusNum] = useState();
    const [status, setStatus] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/applicationThumbnail.php', { //needs to be changed to your own ip
        method: 'post', 
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            applicationID: ID
        }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        setJobID(responseJson[0]);
        setDate(responseJson[1]);
        setUserApplicationID(responseJson[2]);
        setPrice(responseJson[3]);
        setStatusNum(responseJson[4]);
        if (responseJson[4] == -1){
            setStatus("Rejected");
        } else if (responseJson[4] == 0){
            setStatus("Pending");
        } else if (responseJson[4] == 1){
            setStatus("Accepted");
        }
        setJobTitle(responseJson[5]);
    })
    .catch((error) => {
        console.error(error);
    });
    const nav = useNavigation();
    const showApplication = () =>nav.navigate('Application', {ID, price, date, userApplicationID, statusNum, jobTitle});

    return (
        <TouchableOpacity onPress={showApplication}>
            <View style={styles.container}>
                <Image source={{
                    uri: "https://raptor.kent.ac.uk/proj/comp6000/project/08/images/1.jpg"
                }}
                style={styles.image}
                />
                <View style={{padding: 20}}>
                    <Text style={styles.title}>{jobTitle}</Text>
                    <Text style={styles.description}>Status: {status}</Text>
                    <Text style={styles.amount}>Price offer: £{price}/h</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ViewApplication;

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