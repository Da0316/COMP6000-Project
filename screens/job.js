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
        if (sameUser == false && completed == "No" && accepted == "No"){
            return (
                <TouchableOpacity styles={styles.applicationButton} onPress={()=>navigation.navigate('CreateApplication', {jobID})}>
                    <Text style={styles.btnTxt}>Create Application</Text>
                </TouchableOpacity>
            )
        } else if (sameUser == true) {
            return (
                <TouchableOpacity styles={styles.applicationButton} onPress={()=>navigation.navigate('JobApplications', {jobID, jobTitle})}>
                    <Text style={styles.btnTxt}>View Applications</Text>
                </TouchableOpacity>        
            );  
        }
    };

    const profileView = () => {
        if (sameUser == false){
            return (
                <TouchableOpacity styles={styles.applicationButton} onPress = {() => navigation.navigate('ViewProfile', {paramKey: userPostedID,jobID: jobID})}>
                    <Text style={styles.answer}>{username}</Text>
                </TouchableOpacity>
            )
        }
        else{
            return(      
                    <Text style={styles.answer}> You</Text>   
            )

        }
    }
        
    

    return (
        <View style={styles.container}>
            <View style={styles.information}>
                {/* <View style={styles.row}> */}

                    <Text style={styles.title}>{jobTitle}</Text>
                {/* </View> */}
                <View style={styles.row}>
                    <Text style={styles.des}>{jobDescription}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.baseText}> Posted by:{profileView()}</Text>
                    </View>
                <View style={styles.row}>
                    <Text style={styles.baseText}>Speciality: <Text style={styles.answer}>{speciality}</Text></Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.baseText}>Date Posted: <Text style={styles.answer}>{postedDate}</Text></Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.baseText}>Location:</Text>
                </View>
                {/* <View style={styles.row}>
                    <Text style={styles.baseText}>Has the Job Been Accepted: {accepted}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.baseText}>Has the Job Been Completed: {completed}</Text>
                </View> */}
                <View style={styles.row}>
                    <Text style={styles.baseText}>Hourly rate: <Text style={styles.answer}> £{price}</Text></Text>
                </View>
            </View>
            <View style={styles.lower}>
                <View style={styles.applicationButton}>{renderButton()}</View>
            </View>
        </View>
    );
    }


export default Job;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"

    }
    ,title: {
        fontSize: 26, 
        fontWeight: 'bold',
        //alignContent:'center',
        //alignItems:'center',
        textAlign: 'center',
        marginTop:10

    },
    applicationButton: {
        // borderColor: '#FFF',
        // borderWidth: 2,
        // borderRadius: 3,
        // paddingVertical: 10,
        // paddingHorizontal: 50,
        // marginHorizontal: 5,
        //justifyContent:"center",
        //alignSelf:"center",
        alignItems:"center",
        width: "90%",
        flex: 1,
        //flex:1,
        //color: "#000",
        height: 30,
        backgroundColor: "#1a1918",
        borderRadius: 20,
        marginVertical: 15,
       // display: "flex",
        justifyContent: "center",
        //alignItems: "center",
        alignSelf:"center",
        elevation: 5,
    },
    information: {
       flex:12,
       justifyContent:"flex-start",
        paddingHorizontal: 30,
        paddingTop:30,
        //marginBottom: 25,
        backgroundColor:"#f9ce40",
        borderBottomEndRadius:100,
        borderBottomLeftRadius:100,
        //borderRadius:50,
        //alignSelf:"center",
        //alignContent:"stretch"
    },
    row: {
        marginVertical:10,
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
        alignContent:"center",
        fontWeight:"bold"

    },
    des:{
        alignSelf:"center",
        marginVertical:-3,
        opacity:0.5,
        paddingBottom:20
    },
    lower:{
        flex:2,
        backgroundColor:"#fff"
    },
    btnTxt:{
        color:"white",
        fontSize:16,
        fontWeight:"bold"
    },
    answer:{
        fontWeight:"400"

    }
});
