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
    
    if (applicationStatus == -1){
        const status = "Rejected";
    } else if (applicationStatus == 0){
        const status = "Pending";
    } else if (applicationStatus == 1){
        const status = "Accepted";
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
                    <TouchableOpacity style={styles.acceptButton}>
                        <Button title="Accept"></Button>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectButton}>
                        <Button title="Reject"></Button>
                    </TouchableOpacity>
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
        bottom:0,
        left:0,
    },
    acceptButton: {
        flex: 1,
        backgroundColor: 'green',
    },
    rejectButton: {
        flex: 1,
        backgroundColor: 'red',
    },
    mainView: {
        martinTop:40,
        flex: 1,
        flexDirection:'column',
    }
});
