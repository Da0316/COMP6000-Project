import {useState, useEffect} from 'react';
import { ScrollView, View, Text, StyleSheet} from 'react-native';
import ViewApplication from '../components/ViewApplication';

function JobApplications ({route}) {
    const {jobID:jobID} = route.params;
    const [applications, setApplications] = useState([]);
    const [isApplicationEmpty, setIsApplicationEmpty] = useState(null);
    const {jobTitle:jobTitle} = route.params;

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
            if (responseJson == -1){
                setIsApplicationEmpty(true);
            } else {
                setIsApplicationEmpty(false);
                const ids = [];
                let acceptedFound = false;
                for (let i = 0; i < responseJson.length; i+=2){
                    if (responseJson [i + 1] != "-1"){
                        if (responseJson[i + 1] == "1" && acceptedFound == false){
                            acceptedFound = true;
                            let object = {
                                id: responseJson[i],
                                status: responseJson[i + 1],
                            };
                            ids.push(object);
                        }
                        if (acceptedFound == false){
                            let object = {
                                id: responseJson[i],
                                status: responseJson[i + 1],
                            };
                            ids.push(object);   
                        }
                    }   
                };
                setApplications(ids);
            }       
        })
        .catch((error) => {
            alert(error);
        });
        return () => {};
    }, [route]);
    
    if (isApplicationEmpty == false){
        return (
            <View>
                <Text style={styles.title}>{jobTitle} Applications</Text>
                <ScrollView>
                    {applications.map(object => {
                        return <ViewApplication key={object.id} ID={object.id} type={"jobApps"} />
                    })}
                </ScrollView>
            </View>
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

const styles = StyleSheet.create({
    title: {
        padding: 10,
        fontSize: 25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
})