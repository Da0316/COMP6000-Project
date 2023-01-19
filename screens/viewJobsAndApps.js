import {useState, useEffect} from 'react';
import {Text, View, useWindowDimensions, ScrollView} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import ViewJob from "../components/ViewJob";
import ViewApplication from "../components/ViewApplication";

export default ViewJobsAndApps = ({navigation}) => {
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'first', title: 'Jobs'},
        {key: 'second', title: 'Applications'},
    ]);

    const [jobID, setJobID] = useState([]);
    const [applicationID, setApplicationID] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const JobView = () => (
        <ScrollView>
            {jobID.map(object => {
                return <ViewJob key={object.id} ID={object.id}/>
            })}
        </ScrollView>
    );

    const ApplicationView = () => (
        <ScrollView>
            {applicationID.map(object => {
                return <ViewApplication key={object.id} ID={object.id} />
            })}
        </ScrollView>
    );
    
   useEffect(() => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobs.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: global.userID,
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            const ids = [];
            for (let i = 0; i < responseJson.length; i++){
                let object = {
                    id: responseJson[i],
                };
                ids.push(object)
            };
            setJobID(ids);
            setIsLoading(false);
        })
        .catch((error) => {
            alert(error);
        });
    }, []);

    useEffect(() => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/getApplications.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: global.userID,
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            const ids = [];
            for (let i = 0; i < responseJson.length; i++){
                let object = {
                    id: responseJson[i],
                };
                ids.push(object)
            };
            setApplicationID(ids);
            setIsLoading(false);
        })
        .catch((error) => {
            alert(error);
        });
   }, []);
    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={SceneMap({
                first: JobView,
                second: ApplicationView,
                })}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
        >
            {isLoading && <Text>Loading...</Text>}
        </TabView>
    );
}