//homeScreen.js - homepage of the app
//imports
import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import SearchBar from "../components/SearchBar";
import ViewJob from "../components/ViewJob";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import _ from "lodash";

const HomeScreen = ({ navigation }) => {
  //useState variables for all information needed
  const [recentJobIDs, setRecentJobIDs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [userLongAndLat, setUserLongAndLat] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [radius, setRadius] = useState(5000);
  const [modalVisible, setModalVisible] = useState(false);
  const [noNearby, setNoNearby] = useState(null);

  //function that gets user's permission to use phones location services
  const permissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return true;
    } else {
      return false;
    }
  };

  //Function that takes in an address as a parameter and returns the longitude and latitude
  const getLocation = async (address) => {
    //checks if location permissions have been granted
    if (permissions()) {
      let location = await Location.geocodeAsync(address);
      if (location.length > 0) {
        return location[0];
      } else {
        //throws error if an error occurs
        throw new Error("error");
      }
    }
  };

  //function that takes in latitude and longitude as parameters and returns the distance from the logged in users address
  const calculateDistance = (lat, long) => {
    const dis = getDistance(
      {
        latitude: userLongAndLat.latitude,
        longitude: userLongAndLat.longitude,
      },
      { latitude: lat, longitude: long }
    );
    return dis;
  };

  //useEffect hook that gets the logged in user's address
  useEffect(() => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //userID as parameter for backend
      body: JSON.stringify({
        userID: global.userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUserAddress(responseJson[5]);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  //useEffect that sets the latitude and longitude of user's address, refreshes when the address is changed (initially set)
  useEffect(() => {
    if (userAddress != null) {
      getLocation(userAddress)
        .then((location) => {
          let object = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
          setUserLongAndLat(object);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userAddress]);

  //useEffect that gets recent jobs posted on the app
  useEffect(() => {
    try {
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/jobsDate.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        //userID as parameter for backend
        body: JSON.stringify({
          id: global.userID,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //sorts through each job returned
          const ids = [];

          for (let i = 0; i < responseJson.length; i++) {
            let object = {
              id: responseJson[i].jobID,
            };
            //checks if the job hasn't already been completed
            if (responseJson[i].job_completed != 1) {
              ids.push(object);
            }
          }
          //sets the recent jobs
          setRecentJobIDs(ids);
          setLoading(false);
        });
    } catch {
      console.log("error");
    }
  }, []);

  //useEffect that gets the recommended jobs for the user
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/recommendedJobs.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //userID as parameter for backend
        body: JSON.stringify({
          id: global.userID,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //sorts through jobs returned
        const ids = [];
        for (let i = 0; i < responseJson.length; i++) {
          //checks if job wasnt posted by the user logged i
          if (responseJson[i + 1] != global.userID) {
            let object = {
              id: responseJson[i],
            };
            //checks job hasnt been completed
            if (responseJson[i].job_completed != 1) {
              ids.push(object);
            }
          }
        }
        //sets the recommended jobs
        setRecommendedJobs(ids);
      })
      //catches errors
      .catch((error) => {
        alert(error);
      });
  }, []);

  //useEffect that gets the nearby jobs for the user, refreshes if the search distance changes
  useEffect(() => {
    //first checks if the logged in user long and lat are set
    if (userLongAndLat != null) {
      setModalVisible(false);
      fetch(
        "https://raptor.kent.ac.uk/proj/comp6000/project/08/nearbyJobs.php",
        {
          method: "post",
          header: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          //userID as backend parameter
          body: JSON.stringify({
            userID: global.userID,
          }),
        }
      )
        .then((response) => response.json())
        .then(async (responseJson) => {
          //sorts through returned jobs
          let ids = [];
          let count = 0;
          //loop through jobs
          for (let i = 0; i < responseJson.length; i += 2) {
            try {
              //gets the location of the returned job address
              const location = await getLocation(responseJson[i + 1]);
              //if location is set
              if (location) {
                let object = {
                  latitude: location.latitude,
                  longitude: location.longitude,
                };
                //calculates the distance found job is from logged in user's address
                const distance = calculateDistance(
                  object.latitude,
                  object.longitude
                );
                //checks if the distance is within the search radius
                if (distance < radius) {
                  count++;
                  //pushes job to list
                  ids.push({
                    id: responseJson[i],
                  });
                }
              }
            } catch {}
          }
          //checks if no jobs were found, sets variable if true
          if (count == 0) {
            setNoNearby(true);
          } else {
            setNoNearby(false);
          }
          //sets and shuffles nearby jobs
          setNearbyJobs(_.shuffle(ids));
        })
        //catches errors
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    }
    //refresh variables
  }, [userLongAndLat, radius]);

  //navigates to the search screen with search query when called
  const handelSearch = async () => {
    navigation.navigate("SearchScreen", query);
  };

  //converts the radius into KM
  const convert = () => {
    return radius / 1000;
  };

  //function that renders nearby jobs scroll views
  const renderNearby = () => {
    //if there are nearby jobs
    if (noNearby == false) {
      return (
        <ScrollView horizontal={true} style={{marginBottom:50}}>
          {nearbyJobs.map((object) => {
            return <ViewJob key={object.id} ID={object.id} />;
          })}
        </ScrollView>
      );
      //if no nearby jobs
    } else if (noNearby == true) {
      return (
        <View>
          <Text style={({fontWeight: "bold",fontSize: 20,paddingLeft: 8,paddingBottom:20})}>No Jobs Nearby!</Text>
        </View>
      );
    }
  };

  //if the page  is loading
  if (loading) {
    return <Text>Loading....</Text>;
  }

  //main return components
  return (
    <View style={styles.container}>
      {/* Modal that pops up to change search distance */}
      <Modal
        testID="distanceModal"
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* all different types of distances to select */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setRadius(2000)}
            >
              <Text style={styles.textStyle}>2 Km</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setRadius(5000)}
            >
              <Text style={styles.textStyle}>5 Km</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setRadius(10000)}
            >
              <Text style={styles.textStyle}>10 Km</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setRadius(25000)}
            >
              <Text style={styles.textStyle}>25 Km</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonRemove]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Main scroll view */}
      <ScrollView>
        <View style={styles.upperView}>
          <Text style={styles.header}>
            {/* Welcome messages */}
            <Text
              testID="welcome_message"
              style={{ fontWeight: "bold", fontSize: 30, paddingHorizontal: 5 }}
            >
              Hi!
            </Text>
            Search up for tasks that you're good at!
          </Text>
          <View style={styles.searchContainer}>
            {/* Search Bar */}
            <SearchBar
              testID="search_bar"
              searchText={query}
              setSearchText={setQuery}
              style={styles.searchBox}
            />
            {/* Button to search */}
            <TouchableOpacity testID="search_button" onPress={handelSearch}>
              <Text style={styles.searchTxt}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomView}>
          <ScrollView>
            {/* Text and scroll view for recently posted jobs */}
            <Text style={styles.title}>Recent Tasks</Text>
            <ScrollView
              testID="recent_jobs"
              horizontal={true}
              pagingEnabled={true}
            >
              {recentJobIDs.map((object) => {
                return <ViewJob key={object.id} ID={object.id} />;
              })}
            </ScrollView>
            {/* Text and scroll view for recommended jobs */}
            <Text style={styles.title}>Recommended For You</Text>
            <ScrollView testID="recommended_jobs" horizontal={true}>
              {recommendedJobs.map((object) => {
                return <ViewJob key={object.id} ID={object.id} />;
              })}
            </ScrollView>
            <View style={styles.nearbyViewContainer}>
              {/* Text and scroll view for nearby jobs, displaying current distance and button to activate modal to change distance */}
              <Text style={styles.title}>Nearby Your Stored Address: </Text>
              <Pressable
                testID="modal_button"
                style={styles.openButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textStyle}>{convert()} Km</Text>
              </Pressable>
            </View>
            {/* calls function to render all nearby jobs */}
            <View testID="nearby_jobs">{renderNearby()}</View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

// css styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    marginVertical: 10,
    backgroundColor: "fff",
    elevation: 8,
  },
  upperView: {
    width: "100%",
    height: "16%",

    backgroundColor: "#f9ce40",
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    elevation: 10,
  },
  bottomView: {
    width: "100%",
    height: "84%",
    marginBottom: 20,
    marginTop: 5,
  },
  header: {
    justifyContent: "center",
    paddingLeft: 20,
    fontSize: 16,
    paddingVertical: 5,
    paddingTop: 8,
  },
  sortBox: {
    flexGrow: 1,
    alignSelf: "flex-end",
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 8,
  },
  Button: {
    backgroundColor: "green",
    borderRadius: 25,
    width: 80,
    marginLeft: 10,
    mardinRight: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  searchTxt: {
    backgroundColor: "#1a1918",
    borderColor: "#1a1918",
    color: "white",
    marginRight: 10,
    height: 40,
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 5,
    textAlign: "center",
    elevation: 8,
  },
  buttonsView: {
    width: "90%",
    color: "#000",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#f9ce40",
  },
  buttonRemove: {
    backGroundColor: "black",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  nearbyViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:20
  },
  openButton: {
    backgroundColor: "#f9ce40",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
});
