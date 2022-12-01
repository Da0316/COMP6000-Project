import { response } from 'express';
import React, {useState} from 'react';
import {Button, StyleSheet, View, Title, Text} from 'react-native';

function Job(){
    const [jobID, setJobID] = useState(1);
    const [userPostedID, setUserPostedID] = useState(null);
    const [specialityID, setSpecialityID] = useState(null);
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
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }

    return (
        <Text>hello</Text>
    );
};

export default Job;

const styles = StyleSheet.create({
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
    },
});
