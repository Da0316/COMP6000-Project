import {useState, useEffect} from 'react';
import {Text, View, useWindowDimensions, ScrollView, StyleSheet,FlatList } from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
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
    const [isApplicationEmpty, setIsApplicationEmpty] = useState(false);
    const [isJobEmpty, setIsJobEmpty] = useState(false);

    const JobView = () => (
        <FlatList
        data={jobID}
        numColumns={2}
        renderItem={({ item }) => (
            <View style={styles.item}>
              <ViewJob key={item.id} ID={item.id}/>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />

        // <ScrollView>
        //     {jobID.map(object => {
        //         return <ViewJob key={object.id} ID={object.id}/>
        //     })}
        // </ScrollView>
    );

    const ApplicationView = () => (
        <FlatList
          data={applicationID}
          numColumns={2} // set the number of columns in the grid
          renderItem={({ item }) => (
            <View style={styles.item}>
              <ViewApplication key={item.id} ID={item.id} type={"userApps"} />
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      );
    
    const emptyJobView = () => (
        <View>
            <Text>No Jobs Posted</Text>
        </View>
    )

    const emptyApplicationView = () => (
        <View>
            <Text>No Applications Posted</Text>
        </View>
    )
    
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
            if (responseJson == -1){
                setIsJobEmpty(true)
            } else {
                const ids = [];
                for (let i = 0; i < responseJson.length; i++){
                    let object = {
                        id: responseJson[i],
                    };
                    ids.push(object)
                };
                setJobID(ids);  
            }
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
            if (responseJson == -1){
                setIsApplicationEmpty(true);
            } else {
                const ids = [];
                for (let i = 0; i < responseJson.length; i++){
                    let object = {
                        id: responseJson[i],
                    };
                    ids.push(object)
                };
                setApplicationID(ids);
            }
            setIsLoading(false);        
        })
        .catch((error) => {
            alert(error);
        });
    }, []); 

    if (isApplicationEmpty == true && isJobEmpty == true){
        return (
            <TabView
                navigationState={{index, routes}}
                renderScene={SceneMap({
                    first: emptyJobView,
                    second: emptyApplicationView,
                    })}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width,}}
                renderTabBar={props => (
                    <TabBar
                      {...props}
                      renderLabel={({ route, color }) => (
                        <Text style={{ color: 'black', margin: 8 }}>
                          {route.title}
                        </Text>
                      )}
                      style={{backgroundColor: '#f9ce40'}}
                    />
                )}
            >
                {isLoading && <Text>Loading...</Text>}
            </TabView>
        );
    } else if (isApplicationEmpty == false && isJobEmpty == true){
        return (
            <TabView
                navigationState={{index, routes}}
                renderScene={SceneMap({
                    first: emptyJobView,
                    second: ApplicationView,
                    })}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width}}
                renderTabBar={props => (
                    <TabBar
                      {...props}
                      renderLabel={({ route, color }) => (
                        <Text style={{ color: 'black', margin: 8 }}>
                          {route.title}
                        </Text>
                      )}
                      style={{backgroundColor: '#f9ce40'}}
                    />
                )}
            >
                {isLoading && <Text>Loading...</Text>}
            </TabView>
        );
    } else if (isApplicationEmpty == true && isJobEmpty == false){
        return (
            <TabView
                navigationState={{index, routes}}
                renderScene={SceneMap({
                    first: JobView,
                    second: emptyApplicationView,
                    })}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width}}
                renderTabBar={props => (
                    <TabBar
                      {...props}
                      renderLabel={({ route, color }) => (
                        <Text style={{ color: 'black', margin: 8 }}>
                          {route.title}
                        </Text>
                      )}
                      style={{backgroundColor: '#f9ce40'}}
                    />
                )}
            >
                {isLoading && <Text>Loading...</Text>}
            </TabView>
        );
    } else if (isApplicationEmpty == false && isJobEmpty == false){
        return (
            <TabView
                navigationState={{index, routes}}
                renderScene={SceneMap({
                    first: JobView,
                    second: ApplicationView,
                    })}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width}}
                style={styles.tabView}
                renderTabBar={props => (
                    <TabBar
                      {...props}
                      renderLabel={({ route, color }) => (
                        <Text style={{ color: 'black', margin: 8 }}>
                          {route.title}
                        </Text>
                      )}
                      style={{backgroundColor: '#f9ce40'}}
                    />
                )}
            >
                {isLoading && <Text>Loading...</Text>}
            </TabView>
        );
    };   
}

const styles = StyleSheet.create({
    tabView: {
        backgroundColor:"#fff"
        //color: "#FFFFE0",

    },
    item:{
    flex: 1,
    margin: 5,

    }
})