// ViewUser.js - for viewing user's information from the chat
// imports
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Title, Caption, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//main function, takes the selected user information and onBack function as parameters
export default function ViewUser({ selectedUser, onBack }) {
  //sets initial useStates
  const [userID, setUserID] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [phone_number, setPhone_number] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(
    "2846608f-203f-49fe-82f6-844a3f485510.png"
  );
  const [jobsCompleted, setJobsCompleted] = useState(null);
  const [score, setScore] = useState(null);
  const [placeholder, setImagePlaceholder] = useState(false);

  //fetch to get the userID of selectedUser
  fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/chatViewUser.php", {
    method: "post",
    header: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    // backend params
    body: JSON.stringify({
      username: selectedUser.username,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      //sets userID
      setUserID(responseJson);
    });

  //checks if the userID has been set
  if (userID != null) {
    //fetch to get the selectedUser's information from the database
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      // backend params
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //sets all user information
        setFirstname(responseJson[2]);
        setLastname(responseJson[3]);
        setPhone_number(responseJson[7]);
        if (responseJson[8] === null) {
          setImagePlaceholder(true);
        } else {
          if (responseJson[8] === "blank") {
            setImagePlaceholder(true);
          } else {
            setImagePlaceholder(false);
            setSelectedImageName(responseJson[8]);
          }
        }
      });
  }

  //more useStates
  const [jobID, setJobID] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJobEmpty, setIsJobEmpty] = useState(false);

  //useEffect to get the jobs posted from that user
  useEffect(() => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobs.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == -1) {
          setIsJobEmpty(true);
        } else {
          const ids = [];
          for (let i = 0; i < responseJson.length; i++) {
            let object = {
              id: responseJson[i],
            };
            ids.push(object);
          }
          setJobID(ids);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  //fetch call that calculates their review score
  fetch(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateReviewScore.php",
    {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //backend params
      body: JSON.stringify({
        userID: userID,
      }),
    }
  )
    .then((response) => response.json())
    .then((responseJson) => {
      //sets the score
      setScore(responseJson);
    })
    //catches errors
    .catch((error) => {
      alert(error);
    });

  //fetch that calculates how many jobs the selected user has completed
  fetch(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateJobsCompleted.php",
    {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //backend params
      body: JSON.stringify({
        userID: userID,
      }),
    }
  )
    .then((response) => response.json())
    .then((responseJson) => {
      //sets the variable
      setJobsCompleted(responseJson);
    })
    //catches errors
    .catch((error) => {
      alert(error);
    });

  //returns components
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.actionBar}>
        {/* onback button */}
        <TouchableOpacity onPress={onBack}>
          <Image source={require("./assets/back.png")} />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          {/* profile picture */}
          <Avatar.Image
            source={{
              uri: placeholder
                ? "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/" +
                  selectedImageName
                : "https://raptor.kent.ac.uk/proj/comp6000/project/08/" +
                  selectedImageName,
            }}
            size={90}
          />
          <View style={{ marginLeft: 20 }}>
            {/* firstname and lastname */}
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              {firstname} {lastname}
            </Title>
            {/* username */}
            <Caption style={styles.caption}>{selectedUser.username}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          {/* phone number with icon */}
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#777777", marginLeft: 20 }}>
            {phone_number}
          </Text>
        </View>
        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: "#dddddd",
                borderRightWidth: 1,
              },
            ]}
          >
            {/* user review rating */}
            <Title>Ratings Level</Title>
            <Caption>{score}</Caption>
          </View>
          <View style={styles.infoBox}>
            {/* jobs completed */}
            <Title>Jobs Completed</Title>
            <Caption>{jobsCompleted}</Caption>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

//css styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 60,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
  userBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: "#2e64e5",
  },

  reviewForm: {
    backgroundColor: "white",
    paddingTop: 3,
    marginTop: 10,
    paddingBottom: 60,
  },
  actionBar: {
    backgroundColor: "#cacaca",
    height: 41,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
