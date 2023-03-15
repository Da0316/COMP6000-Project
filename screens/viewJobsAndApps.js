//viewJobsAndApps.js - main page for viewing applications and jobs sent/posted by logged in user
//imports
import { useState, useEffect } from "react";
import {
  Text,
  View,
  useWindowDimensions,
  StyleSheet,
  FlatList,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ViewJob from "../components/ViewJob";
import ViewApplication from "../components/ViewApplication";

export default ViewJobsAndApps = ({ navigation }) => {
  //variables and useStates for page
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Jobs" },
    { key: "second", title: "Applications" },
  ]);

  const [jobID, setJobID] = useState([]);
  const [applicationID, setApplicationID] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isApplicationEmpty, setIsApplicationEmpty] = useState(false);
  const [isJobEmpty, setIsJobEmpty] = useState(false);

  //function that renders the flatlist for jobs the logged in user has posted
  const JobView = () => (
    <FlatList
      data={jobID}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ViewJob key={item.id} ID={item.id} />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
  
  //function that renders the flatlist for application the logged in user has sent of for other user's jobs
  const ApplicationView = () => (
    <FlatList
      data={applicationID}
      numColumns={2} // set the number of columns in the grid
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ViewApplication key={item.id} ID={item.id} type={"userApps"} />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );

  //function that renders when no jobs have been posted
  const emptyJobView = () => (
    <View>
      <Text>No Jobs Posted</Text>
    </View>
  );

  //function that renders when no applications have been sent
  const emptyApplicationView = () => (
    <View>
      <Text>No Applications Posted</Text>
    </View>
  );

  //useEffect that gets all the jobs the user has posted
  useEffect(() => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobs.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //userID parameter for the backend
      body: JSON.stringify({
        id: global.userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //checks if there are no jobs posted
        if (responseJson == -1) {
          //sets variable to true
          setIsJobEmpty(true);
        } else {
          //loops through returned jobs, creating new objects and adding them to an array
          const ids = [];
          for (let i = 0; i < responseJson.length; i++) {
            let object = {
              id: responseJson[i],
            };
            ids.push(object);
          }
          setJobID(ids);
        }
        //sets loading to false
        setIsLoading(false);
      })
      //catches errors
      .catch((error) => {
        alert(error);
      });
  }, []);

  //useEffect that gets all the applications the user has sent off to other user's jobs
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/getApplications.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //userID paramater for backend
        body: JSON.stringify({
          id: global.userID,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //checks if no applications have been sent
        if (responseJson == -1) {
          //sets variable to true
          setIsApplicationEmpty(true);
        } else {
          //loops through returned applications, creating new objects and adding them to an array
          const ids = [];
          for (let i = 0; i < responseJson.length; i++) {
            let object = {
              id: responseJson[i],
            };
            ids.push(object);
          }
          setApplicationID(ids);
        }
        //sets loading to false
        setIsLoading(false);
      })
      //catches errors
      .catch((error) => {
        alert(error);
      });
  }, []);

  //all types of the return use a tabview, first tab being the jobs, and second half being the applications
  //if there are no jobs and no applications
  if (isApplicationEmpty == true && isJobEmpty == true) {
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: emptyJobView,
          second: emptyApplicationView,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "black", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#f9ce40" }}
          />
        )}
      >
        {isLoading && <Text>Loading...</Text>}
      </TabView>
    );
    //if there are applications but there are no jbos
  } else if (isApplicationEmpty == false && isJobEmpty == true) {
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: emptyJobView,
          second: ApplicationView,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "black", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#f9ce40" }}
          />
        )}
      >
        {isLoading && <Text>Loading...</Text>}
      </TabView>
    );
    //if there are no applications but there are jobs
  } else if (isApplicationEmpty == true && isJobEmpty == false) {
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: JobView,
          second: emptyApplicationView,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "black", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#f9ce40" }}
          />
        )}
      >
        {isLoading && <Text>Loading...</Text>}
      </TabView>
    );
    //if there are both jobs and applications
  } else if (isApplicationEmpty == false && isJobEmpty == false) {
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: JobView,
          second: ApplicationView,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: "black", margin: 8 }}>{route.title}</Text>
            )}
            style={{ backgroundColor: "#f9ce40" }}
          />
        )}
      >
        {isLoading && <Text>Loading...</Text>}
      </TabView>
    );
  }
};

//css stylign
const styles = StyleSheet.create({
  tabView: {
    backgroundColor: "#fff",
  },
  item: {
    flex: 1,
    margin: 5,
  },
});
