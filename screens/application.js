import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';

function Application({route, navigation}){
    const {ID:applicationID} = route.params;
    const [usernameApplied, setUsernameApplied] = useState('');
    const {price:priceOffer} = route.params;
    const {date:applicationDate} = route.params;
    const {statusNum:applicationStatus} = route.params;
    const {userApplicationID:userAppID} = route.params;
    
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
    
    const handleAction = (choice) => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/acceptReject.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            applicationID: applicationID,
            choice: choice
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
              if (responseJson == 1 && choice == "Accept") {
                alert("Application Accepted, Chatroom opened!");
                navigation.navigate("HomeScreen");
              } else if (responseJson == 1 && choice == "Reject") {
                alert("Application Rejected");
              } else if (responseJson == -1) {
                alert("error");
              }
        })
        .catch((error) => {
            alert(error);
        });
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
        return (
            <View style={styles.mainView}>
                <View>
                    <Text>Username: {usernameApplied}</Text>
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
    }
}

export default Application;

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
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
        marginTop: 40,
        flex: 1,
        flexDirection: 'column',
    }
});
