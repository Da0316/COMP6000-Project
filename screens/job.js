import React, {useState} from 'react';
import {Button, StyleSheet, View, Title, Text} from 'react-native';
import { useRoute } from '@react-navigation/native';

function Job(){
    const route = useRoute();
    console.log(route.params.jobID);    
    const [jobID, setJobID] = useState(1);
    const [userPostedID, setUserPostedID] = useState(null);
    const [specialityID, setSpecialityID] = useState(null);
    const [jobTitle, setJobTitle] = useState(null);
    const [jobDescription, setJobDescription] = useState(null);
    const [postedDate, setPostedDate] = useState(null);
    const [accepted, setAccepted] = useState(null);
    const [completed, setCompleted] = useState(null);
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
            setAccepted(responseJson[5]);
            setCompleted(responseJson[6]);
            setPrice(responseJson[7]);
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }

    return (
        <Text>{jobDescription}</Text>
    );
};

export default Job;

const styles = StyleSheet.create({
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
    },
});
