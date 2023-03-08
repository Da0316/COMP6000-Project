import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { lastIndexOf } from "lodash";

const Profile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const isFocused = useIsFocused();
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [date_of_birth, setDate_of_birth] = useState(null);
  const [address, setAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone_number, setPhone_number] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(
    "2846608f-203f-49fe-82f6-844a3f485510.png"
  );
  const [jobsCompleted, setJobsCompleted] = useState(null);
  const [reviews, setReview] = useState([]);
  const [placeholder, setImagePlaceholder] = useState(false);
  const [score, setScore] = useState(false);

  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem("user_id");

      if (value !== null) {
        setUserID(value);
      }
    } catch (e) {
      alert("Failed to fetch the input from storage");
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <View
        key={item?.id}
        style={{
          marginBottom: 20,
          elevation: 1,
          padding: 10,
          backgroundColor: "#EBEBEB",
          flex: 1,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View
          key={item?.id}
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <Image
            key={index + 1}
            source={{
              uri: item?.image
                ? "https://raptor.kent.ac.uk/proj/comp6000/project/08/" +
                  item?.image
                : "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/2846608f-203f-49fe-82f6-844a3f485510.png",
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 60 / 2,
              overflow: "hidden",
              borderWidth: 1,
            }}
          />
          <View key={item?.id}>
            <Text
              key={index + 2}
              style={{
                width: "40%",
                marginLeft: 15,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {item?.username}
            </Text>
            <Caption
              key={index + 3}
              style={{
                width: "100%",
                marginLeft: 15,
                fontSize: 12,
                marginBottom: 3,
                marginTop: -1,
              }}
            >
              {item?.timestamp}
            </Caption>
            <Text
              key={index + 4}
              style={{
                width: "90%",
                marginLeft: 15,
                marginBottom: 5,
                fontSize: 16,
              }}
            >
              Rating : {item?.rating} /5
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            elevation: 4,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Text
            key={index + 5}
            style={{ width: "80%", textAlign: "justify", padding: 10 }}
          >
            {item?.review_text}
          </Text>
        </View>
      </View>
    );
  };
  const fetchReview = async () => {
    const params = new FormData();
    params.append("jobid", userID);
    params.append("type", "user");

    const res = await axios.post(
      `https://raptor.kent.ac.uk/proj/comp6000/project/08/reviews.php`,
      params
    );
    setReview(res?.data);
  };

  useEffect(() => {
    readData();
    console.disableYellowBox = true;
  }, [isFocused]);

  useEffect(() => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUsername(responseJson[1]);
        setFirstname(responseJson[2]);
        setLastname(responseJson[3]);
        setDate_of_birth(responseJson[4]);
        setAddress(responseJson[5]);
        setEmail(responseJson[6]);
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
        fetchReview();
        console.disableYellowBox = true;
      })
      .catch((error) => {});
  }, [userID, isFocused]);

  fetch(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateReviewScore.php",
    {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: global.userID,
      }),
    }
  )
    .then((response) => response.json())
    .then((responseJson) => {
      setScore(responseJson);
    })
    .catch((error) => {
      alert(error);
    });

  fetch(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateJobsCompleted.php",
    {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: global.userID,
      }),
    }
  )
    .then((response) => response.json())
    .then((responseJson) => {
      setJobsCompleted(responseJson);
    })
    .catch((error) => {
      alert(error);
    });
  const logoutUser = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      navigation.navigate("Login");
      return true;
    } catch (exception) {
      return false;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView style={styles.scrollView}> */}
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
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
            <Caption style={styles.caption}>{username}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#1A1918" size={20} />
          <Text style={{ color: "#1A1918", marginLeft: 20 }}>{address}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#1A1918" size={20} />
          <Text style={{ color: "#1A1918", marginLeft: 20 }}>
            {phone_number}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#1A1918" size={20} />
          <Text style={{ color: "#1A1918", marginLeft: 20 }}>{email}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="calendar" color="#1A1918" size={20} />
          <Text style={{ color: "#1A1918", marginLeft: 20 }}>
            {date_of_birth}
          </Text>
        </View>

        <View style={styles.userBtnWrapper}>
          <TouchableRipple
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert("Logout ", "Do you really want to logout?", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    logoutUser("user_id");
                  },
                },
              ]);
            }}
          >
            <Text style={styles.userBtnTxt}> Logout</Text>
          </TouchableRipple>
          <TouchableRipple
            style={styles.userBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.userBtnTxt}> Edit Profile</Text>
          </TouchableRipple>
          <TouchableRipple
            style={styles.userBtn}
            onPress={() => navigation.navigate("ViewJobsAndApps")}
          >
            <Text style={styles.userBtnTxt}>View Jobs/Applications</Text>
          </TouchableRipple>
        </View>

        <View style={styles.infoBoxWrapper}>
          <View style={styles.infoBox}>
            <Text style={styles.title2}>Ratings Level</Text>
            <Caption style={styles.titlenum}>{score}</Caption>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.title2}>Jobs Completed</Text>
            <Caption style={styles.titlenum}>{jobsCompleted}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.title3}>Reviews</Text>
        <FlatList
          key={11}
          nestedScrollEnabled
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item?.timestamp}
          showsVerticalScrollIndicator={false}
          inverted={true}
          style={{ flex: 1, width: "95%" }}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title2: {
    flexDirection: "column",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    textAlign: "center",
    fontFamily: "sans-serif-medium",
  },
  titlenum: {
    fontSize: 16,
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
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    paddingHorizontal: 3,
    elevation: 5,
    width: 100,
    height: 100,
    borderRadius: 1000,
    backgroundColor: "#f9ce40",
    transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: "0deg" }],
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
    marginTop: 3,
  },
  userBtn: {
    backgroundColor: "#1a1918",
    color: "#FFFFF",
    borderRadius: 25,
    justifyContent: "center",
    height: 30,
    elevation: 5,
    paddingHorizontal: 10,
    marginHorizontal: 3,
  },
  userBtnTxt: {
    color: "#FFFFFF",
  },

  reviewSection: {
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#de3737",
    color: "#FFFFF",
    borderRadius: 25,
    justifyContent: "center",
    height: 30,
    elevation: 5,
    paddingHorizontal: 10,
    marginHorizontal: 3,
  },
  reviewSection: {
    alignItems: "center",
    flex: 1,
  },
  title3: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginVertical: 5,
  },
});
