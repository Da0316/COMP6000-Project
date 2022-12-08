import React, {useState} from 'react';
import {Button, StyleSheet, View, Title, Text, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

function Job({route, navigation}){
    const { jobID } = route.params;
    const [userPostedID, setUserPostedID] = useState(null);
    const [specialityID, setSpecialityID] = useState(null);
    const [jobTitle, setJobTitle] = useState(null);
    const [jobDescription, setJobDescription] = useState(null);
    const [postedDate, setPostedDate] = useState(null);
    const [accepted, setAccepted] = useState("");
    const [completed, setCompleted] = useState("");
    const [price, setPrice] = useState(null);

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
            setSpecialityID(responseJson[1]);
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
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }

    //const createApplication = () => useNavigation().navigate('CreateApplication')

    return (
        <View styles={styles.container}>
            <View styles={styles.information}>
                <View styles={styles.row}>
                    <Text>{userPostedID}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{specialityID}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{jobTitle}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{jobDescription}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{postedDate}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{accepted}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{completed}</Text>
                </View>
                <View styles={styles.row}>
                    <Text>{price}</Text>
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
