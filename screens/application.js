import {useEffect, useState} from 'react';
import {} from 'react-native';

function Application({route, navigation}){
    const {applicationID} = route.params;
    const [usernamePosted, setUsernamePosted] = useState('');
    const [userPostedID, setUserPostedID] = useState('');
    const [priceOffer, setPriceOffer] = useState('');
    const [applicationDate, setApplicationDate] = useState('');

    try {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/viewApplication.php', {
            method: 'post',
            header: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                applicationID: applicationID,
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
           console.log(responseJson);
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
}

export default Application;