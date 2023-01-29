import {useState, useEffect} from 'react';
import { ScrollView, View, Text} from 'react-native';
import ViewApplication from '../components/ViewApplication';

function JobApplications ({route, navigation}) {
    const {jobID} = route.params;
    const [applications, setApplications] = useState([]);
    const [isApplicationEmpty, setIsApplicationEmpty] = useState(null);
    const [applicationHasBeenAccepted, setApplicationHasBeenAccepted] = useState(false);

    useEffect(() => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobApplications.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: jobID,
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if (responseJson == -1){
                setIsApplicationEmpty(true);
            } else {
                setIsApplicationEmpty(false);
                const ids = [];
                for (let i = 0; i < responseJson.length; i + 2){
                    let object = {
                        id: responseJson[i],
                        status: responseJson[i + 1],
                    };
                    console.log(object)
                    ids.push(object)
                };
                setApplications(ids);
            }       
        })
        .catch((error) => {
            alert(error);
        });
    }, []);
    
    if (isApplicationEmpty == false){
        return (
            <ScrollView>
                {applications.map(object => {
                    return <ViewApplication key={object.id} ID={object.id} />
                })}
            </ScrollView>
        );
    } else if (isApplicationEmpty == true){
        return (
            <View>
                <Text>No Applications have been made</Text>
            </View>
        );
    }
};

export default JobApplications;