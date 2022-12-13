import React from 'react';
import {} from 'react-native';

function SelectSpecialities({route, navigation}){
    const options = [];
    const {userID} = route.params;
    console.log(userID);
    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/Specialities.php', {
        method: 'post',
        header : {
            Accept: 'application/json',
            'Content-type' : 'application/json',
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        console.log(userID);
    })
    .catch((error) => {
        //alert(error)
    });
}

export default SelectSpecialities;