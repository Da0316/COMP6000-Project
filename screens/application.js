import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {getDatabase, get, ref, set, onValue, update, push, child} from 'firebase/database'
import ViewProfile from './viewProfile';

function Application({route, navigation}){
    const {ID:applicationID} = route.params;
    const [usernameApplied, setUsernameApplied] = useState('');
    const {price:priceOffer} = route.params;
    const {date:applicationDate} = route.params;
    const {statusNum:applicationStatus} = route.params;
    const {userApplicationID:userAppID} = route.params;
    const {jobTitle:jTitle} = route.params;
    const {jobID:jobID} = route.params;
    //const [usernameLoggedIn, setUsernameLoggedIn] = useState('');
    
    try {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
            method: 'post',
            header: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userID: userAppID,
            }),
        })    
        .then((response) => response.json())
        .then((responseJson) => {
            setUsernameApplied(responseJson[1]);
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
    
    const onAddFriend = async () => {
            try {
                //useEffect(() => { 
                    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
                        method: 'post',
                        header: {
                            Accept: 'application/json',
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            userID: global.userID,
                        }),
                    })    
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        //setUsernameLoggedIn(responseJson[1]);
                        let usernameLoggedIn = responseJson[1];
                        const database = getDatabase();


                        const userAppliedSnapShot = await get(ref(database, 'users/' + usernameApplied));
                        const userApplied = userAppliedSnapShot.val();

                        const userLoggedInSnapShot = await get(ref(database, 'users/' + usernameLoggedIn));
                        const userLoggedIn = userLoggedInSnapShot.val();

                        let found = false;
                        const foundChatroomkey = null
                        const chatroomsSnapshot = await get(ref(database, "chatrooms/"));

                        chatroomsSnapshot.forEach((childSnapshot) => {
                            const chatroom = childSnapshot.val();
                            if ((userApplied.username == chatroom.firstUser && userLoggedIn.username ==chatroom.secondUser) ||
                            (userApplied.username == chatroom.secondUser && userLoggedIn.username ==chatroom.firstUser)){
                                found = true;
                                const lastMessages = chatroom.messages || [];
                                console.log(lastMessages);
                                update(ref(database, 'chatrooms/' + childSnapshot.key), {
                                    messages: [
                                        ...lastMessages,
                                        {
                                            text: usernameLoggedIn + " has accepted your application for '" + jTitle + "' at the rate of £" + priceOffer + "/hr. Discuss a suitable dates and time!",
                                            sender: userLoggedIn.username,
                                            createdAt: new Date(),
                                        },
                                    ],
                                });
                                update(ref(database, "chatrooms/" + childSnapshot.key), {
                                    jobID: jobID
                                });
                                if (chatroom.firstUser != userLoggedIn.username){
                                    update(ref(database, "chatrooms/" + childSnapshot.key), {
                                        firstUser: userLoggedIn.username,
                                        secondUser: userApplied.username
                                    });
                                }
                            }
                        })

                        if (found == false){
                            const newChatRoomRef = push(ref(database, 'chatrooms'), {
                                firstUser: userLoggedIn.username,
                                secondUser: userApplied.username,
                                messages: [],
                                jobID: jobID,
                            })

                            const newChatroomID = newChatRoomRef.key;
                            const userAppliedFriends = userApplied.friends || [];

                            update(ref(database, 'users/' + userApplied.username), {
                                friends: [
                                    ...userAppliedFriends,
                                    {
                                        username: userLoggedIn.username,
                                        avatar: userLoggedIn.avatar,
                                        chatroomId: newChatroomID,
                                    },
                                ],
                            });

                            const myFriends = userLoggedIn.friends || [];

                            update(ref(database, 'users/' + userLoggedIn.username), {
                                friends: [
                                    ...myFriends,
                                    {
                                        username: userApplied.username,
                                        avatar: userApplied.avatar,
                                        chatroomId: newChatroomID,
                                    },
                                ],
                            });

                            update(ref(database, 'chatrooms/' + newChatroomID), {
                                messages: [
                                    {
                                        text: usernameLoggedIn + " has accepted your application for '" + jTitle + "' at the rate of £" + priceOffer + "/hr. Discuss a suitable dates and time!",
                                        sender: userLoggedIn.username,
                                        createdAt: new Date(),
                                    },
                                ],
                            });
                        } else if (found == true){
                            update(ref(database, 'chatrooms/' + foundChatroomkey), {
                                messages: [
                                    {
                                        text: usernameLoggedIn + " has accepted your application for '" + jTitle + "' at the rate of £" + priceOffer + "/hr. Discuss a suitable dates and time!",
                                        sender: userLoggedIn.username,
                                        createdAt: new Date(),
                                    },
                                ],
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                
                //}, []);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAction = (choice) => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/acceptReject.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            applicationID: applicationID,
            choice: choice,
            priceOffer, priceOffer
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
              if (responseJson == 1 && choice == "Accept") {
                alert("Application Accepted, Chatroom opened!");
                onAddFriend();
                navigation.navigate("HomeScreen");
              } else if (responseJson == 1 && choice == "Reject") {
                alert("Application Rejected");
                navigation.navigate("JobApplications", {jobID});
              } else if (responseJson == -1) {
                alert("error");
              }
        })
        .catch((error) => {
            alert(error);
        });
    }

    const profileView = () => {
        return (
            <TouchableOpacity onPress = {() => navigation.navigate('ViewProfile', {paramKey: userAppID,jobID: jobID})}>
                <Text>{usernameApplied}</Text>
            </TouchableOpacity>
        );
    }

    let status;
    if (applicationStatus == -1){
        status = "Rejected";
    } else if (applicationStatus == 0){
        status = "Pending";
    } else if (applicationStatus == 1){
        status = "Accepted";
    }

    if (userAppID == global.userID){
        return (
            <View>
                <Text>TODO</Text>
            </View>
        );
    } else {
        console.log(applicationStatus);
        if (applicationStatus == 0){
            return (
                <View style={styles.mainView}>
                    <View>
                        <Text>Username: {profileView()}</Text>
                        <Text>Application Date: {applicationDate}</Text>
                        <Text>Price Offered: ${priceOffer}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button
                                title="Accept"
                                color="green"
                                onPress={() => handleAction("Accept")}
                            />
                        </View>
                        <View style={styles.button}>
                            <Button
                                title="Reject"
                                color="red"
                                onPress={() => handleAction("Reject")}
                            />
                    </View>
                    </View>
                </View>
            );
        } else if (applicationStatus == 1) {
            return (
                <View style={styles.mainView}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTxt}>Username: {profileView()}</Text>
                        <Text style={styles.infoTxt}>Application Date: {applicationDate}</Text>
                        <Text style={styles.infoTxt}>Price Offered: ${priceOffer}</Text>
                        <Text style={styles.infoTxt}>Accepted</Text>
                    </View>
                    {/* <View style={styles.buttonContainer}>
                        <Text>Accepted</Text>
                    </View> */}
                </View>
            );
        } else if (applicationStatus == -1){
            return (
                <View style={styles.mainView}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTxt} >Username: {profileView()}</Text>
                        <Text style={styles.infoTxt}>Application Date: {applicationDate}</Text>
                        <Text style={styles.infoTxt}>Price Offered: ${priceOffer}</Text>
                        <Text style={styles.infoTxt}>Rejected</Text>
                    </View>
                    {/* <View style={styles.buttonContainer}>
                        <Text>Rejected</Text>
                    </View> */}
                </View>
            );
        }
    }
}

export default Application;

const styles = StyleSheet.create({
    buttonContainer: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    button: {
        flex: 1,
    },
    mainView: {
        flex:1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#fff"
        //justifyContent: 'flex-end',
        // marginTop: 40,
        // flex: 1,
        // flexDirection: 'column',
    },
    infoBox:{
        //flex:1,
        width: '60%',
        height: '40%',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal:10,
        //alignItems: "center",
        backgroundColor:"#f9ce40",
        borderTopEndRadius:70,
        borderTopLeftRadius:70,
        borderBottomLeftRadius:70,
        borderBottomRightRadius:70,
        elevation:30
        //alignItems: 'center',

    },
    infoTxt:{
        fontSize:16,
        
        paddingVertical:5,
    }
});
