import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const ViewApplication = ({ID, type}) => {
    const [jobID, setJobID] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [userApplicationID, setUserApplicationID] = useState('');
    const [statusNum, setStatusNum] = useState();
    const [status, setStatus] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [usernameApplied, setUsernameApplied] = useState('');
    useEffect (() => {
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
    }, []);
    const jobApplications = () => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
            method: 'post',
            header: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userID: userApplicationID,
            }),
         })    
        .then((response) => response.json())
        .then((responseJson) => {
            setUsernameApplied(responseJson[1]);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    

    const nav = useNavigation();

    const showApplication = () =>nav.navigate('Application', {ID, price, date, userApplicationID, statusNum, jobTitle, jobID});

    const showJob = () => nav.navigate('Job', {jobID});

    if (type == "userApps"){
        return (
            <TouchableOpacity onPress={showJob}>
                <View style={styles.userApplicationContainer}>
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
    } else if (type == "jobApps"){
        jobApplications();
        return (
                <TouchableOpacity onPress={showApplication}>
                    <View style={styles.jobApplicationsContainer}>
                        <View style={{padding: 20}}>
                            <Text style={styles.title}>{usernameApplied}</Text>
                            <Text style={styles.description}>Status: {status}</Text>
                            <Text style={styles.amount}>Price offer: £{price}/h</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        )
    }
}

export default ViewApplication;

const styles = StyleSheet.create({ 
    jobApplicationsContainer:{
        width:"90%",
        alignSelf: "center",
        borderRadius: 40,
        backgroundColor: "#FFFFE0",
        marginTop: 20
    },
    userApplicationContainer: {
        width:"90%",
        alignSelf: "center",
        borderRadius: 40,
        backgroundColor: "#E4F6F8",
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
        color:"black",
        marginTop:10
    }
})