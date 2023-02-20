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
    const [sameUser, setSameUser] = useState(null);
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
            if (userPostedID == global.userID){
                setSameUser(true);
            } else {
                setSameUser(false);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }

    const renderButton = () => {
        if (sameUser == false){
            return (
                <TouchableOpacity styles={styles.applicationButton} onPress={()=>navigation.navigate('CreateApplication', {jobID})}>
                    <Text>Create Application</Text>
                </TouchableOpacity>
            )
        } else if (sameUser == true) {
            return (
                <TouchableOpacity styles={styles.applicationButton} onPress={()=>navigation.navigate('JobApplications', {jobID, jobTitle})}>
                    <Text>View Applications</Text>
                </TouchableOpacity>        
            );  
        }
    };

    const profileView = () => {
        if (sameUser == false){
            return (
                <TouchableOpacity styles={styles.applicationButton} onPress = {() => navigation.navigate('ViewProfile', {paramKey: userPostedID,jobID: jobID})}>
                    <Text styles={styles.row}>Posted By:{username}</Text>
                </TouchableOpacity>
            )
        }
        else{
            return(
                <View styles={styles.row}>
                    <Text styles={styles.row} >Posted By: {username}</Text>
                </View>
            )

        }
    }
        
    

    return (
        <View styles={{backgroundColor:"#FFFFFF",flex:1}}>
            <View styles={styles.information}>
                <View styles={styles.row}>

                    <Text style={styles.title}>{jobTitle}</Text>
                </View>
                <View styles={styles.row}>{profileView()}</View>
                <View styles={styles.row}>
                    <Text style={styles.baseText}>Speciality: {speciality}</Text>
                </View>
                <View styles={styles.row}>
                    <Text style={styles.baseText}>Description: {jobDescription}</Text>
                </View>
                <View styles={styles.row}>
                    <Text style={styles.baseText}>Date Posted: {postedDate}</Text>
                </View>
                <View styles={styles.row}>
                    <Text style={styles.baseText}>Has the Job Been Accepted: {accepted}</Text>
                </View>
                <View styles={styles.row}>
                    <Text style={styles.baseText}>Has the Job Been Completed: {completed}</Text>
                </View>
                <View styles={styles.row}>
                    <Text style={styles.baseText}>Price: ${price}</Text>
                </View>
                <View style={styles.applicationButton}>{renderButton()}</View>
            </View>
            
        </View>
    );
    }


export default Job;

const styles = StyleSheet.create({
    title: {
        fontSize: 24, 
        fontWeight: 'bold',
        alignContent:'center',
        alignItems:'center',
        textAlign: 'center',

    },
    applicationButton: {
        // borderColor: '#FFF',
        // borderWidth: 2,
        // borderRadius: 3,
        // paddingVertical: 10,
        // paddingHorizontal: 50,
        // marginHorizontal: 5,
        width: "90%",
        //color: "#000",
        height: 50,
        backgroundColor: "#f9ce40",
        borderRadius: 10,
        marginVertical: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf:"center",
        elevation: 5,
    },
    container: {
        flex: 1,
        backgroundColor:"#FFFFFF"
    },
    information: {
        paddingHorizontal: 30,
        marginBottom: 25,
        backgroundColor:"#FFFFFF"
        //alignSelf:"center",
        //alignContent:"stretch"
    },
    row: {
        marginVertical:20,
        //paddingHorizontal:10,
        //paddingVertical:20,
        // alignContent:"stretch",
        //flexDirection: 'row',
        //marginBottom: 10,
        //textAlign: "center",
        //alignItems: 'center',

        //justifyContent:"space-between",
        //marginHorizontal:5
    },
    baseText:{
        alignContent:"center"

    }
});
