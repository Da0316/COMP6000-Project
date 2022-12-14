import React, {useState} from 'react';
import {Button, StyleSheet, View, Title, Text, TouchableOpacity} from 'react-native';

function Job({route, navigation}){
    const { jobID } = route.params;
    const [userPostedID, setUserPostedID] = useState(null);
    const [speciality, setSpeciality] = useState(null);
    const [jobTitle, setJobTitle] = useState(null);
    const [jobDescription, setJobDescription] = useState(null);
    const [postedDate, setPostedDate] = useState(null);
    const [accepted, setAccepted] = useState("");
    const [completed, setCompleted] = useState("");
    const [price, setPrice] = useState(null);
    const [username, setUsername] = useState(null);
    try {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/job.php', {
            method: 'post',
            header: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                jobID: jobID
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            setUserPostedID(responseJson[0]);
            setSpeciality(responseJson[1]);
            setJobTitle(responseJson[2]);
            setJobDescription(responseJson[3]);
            setPostedDate(responseJson[4]);
            if (responseJson[5] == "0"){
                setAccepted("No");
            } else {
                setAccepted("Yes");
            }
            if (responseJson[6] == "0"){
                setCompleted("No");
            } else {
                setCompleted("Yes");
            }
            setPrice(responseJson[7]);
            setUsername(responseJson[8]);
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }

    return (
        <View styles={styles.container}>
            <View styles={styles.information}>
                <View styles={styles.row}>
                    <Text>{jobTitle}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Posted By: {username}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Speciality: {speciality}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Description: {jobDescription}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Date Posted: {postedDate}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Has the Job Been Accepted: {accepted}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Has the Job Been Completed: {completed}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>Price: ${price}</Text>
                </View>
            </View>
            <TouchableOpacity styles={styles.applicationButton} onPress={()=>navigation.navigate('CreateApplication', {jobID})}>
                <Text>Create Application</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Job;

const styles = StyleSheet.create({
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
    },
    applicationButton: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 10,
        paddingHorizontal: 50,
        marginHorizontal: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#EEF5DB',
    },
    information: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
});
