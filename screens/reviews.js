// Import necessary dependencies
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";

const Reviews = ({ navigation, route }) => {
  // Declare and initialize the component state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReview] = useState([]);
  const [write, setWrite] = useState([]);
  const [userID, setUserID] = useState("");
  const [userPostedID, setUserPostedID] = useState(route?.params?.userPostedID);
  const isFocused = useIsFocused();
  const [jobid, setJobId] = useState(route?.params?.jobId);

  // Function to read the user ID from local storage
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
   // Function to fetch reviews for the job from the server
  const fetchReview = async () => {
    const params = new FormData();
    params.append("jobid", jobid);
    params.append("type", "post");
    params.append("userposted", jobid);
    const res = await axios.post(
      `https://raptor.kent.ac.uk/proj/comp6000/project/08/reviews.php`,
      params
    );
    setReview(res?.data);
  };
  // Function to write a review for the job to the server
  const writeReview = async (jobid, userid, rating, reviewtxt) => {
    const params = new FormData();
    params.append("jobid", jobid);
    params.append("userID", userid);
    params.append("review_text", reviewtxt);
    params.append("userposted", userPostedID);
    params.append("rating", rating);

    const res = await axios.post(
      `https://raptor.kent.ac.uk/proj/comp6000/project/08/writereviews.php`,
      params
    );
    setWrite(res?.data);
    if (res?.data === 1) {
      alert("Review posted successfully");
    } else {
      alert("something went wrong");
    }
  };
  useEffect(() => {
    readData();
    fetchReview();
  }, [write, isFocused]);
   // Function to render an individual review
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          marginVertical: 10,
          elevation: 10,
          padding: 10,
          backgroundColor: "#EBEBEB",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Image
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
          <View>
            <Text
              style={{
                width: "45%",
                marginLeft: 15,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {item?.username}
            </Text>
            <Caption
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
              style={{
                width: "90%",
                marginLeft: 15,
                marginBottom: 5,
                fontSize: 16,
              }}
            >
              Rating :{item?.rating} /5
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
            style={{
              width: "80%",
              textAlign: "auto",
              paddingVertical: 20,
              paddingHorizontal: 8,
            }}
          >
            {item?.review_text}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Title style={{ fontWeight: "bold", marginLeft: 25 }}>
        Write a Review
      </Title>
      <View
        style={{
          alignItems: "center",
          marginBottom: 50,
          backgroundColor: "#f9ce40",
        }}
      >
        <View style={styles.reviewSection}>
          <Text style={{ marginBottom: 5 }}>Your Rating:</Text>
          <View style={styles.ratingSection}>
            <TouchableRipple onPress={() => setRating(1)}>
              <Avatar.Icon
                style={
                  rating >= 1
                    ? { backgroundColor: "#ffa534" }
                    : { backgroundColor: "#939394" }
                }
                icon="star"
              />
            </TouchableRipple>
            <TouchableRipple onPress={() => setRating(2)}>
              <Avatar.Icon
                style={
                  rating >= 2
                    ? { backgroundColor: "#ffa534" }
                    : { backgroundColor: "#939394" }
                }
                icon="star"
              />
            </TouchableRipple>
            <TouchableRipple onPress={() => setRating(3)}>
              <Avatar.Icon
                style={
                  rating >= 3
                    ? { backgroundColor: "#ffa534" }
                    : { backgroundColor: "#939394" }
                }
                icon="star"
              />
            </TouchableRipple>
            <TouchableRipple onPress={() => setRating(4)}>
              <Avatar.Icon
                style={
                  rating >= 4
                    ? { backgroundColor: "#ffa534" }
                    : { backgroundColor: "#939394" }
                }
                icon="star"
              />
            </TouchableRipple>
            <TouchableRipple onPress={() => setRating(5)}>
              <Avatar.Icon
                style={
                  rating >= 5
                    ? { backgroundColor: "#ffa534" }
                    : { backgroundColor: "#939394" }
                }
                icon="star"
              />
            </TouchableRipple>
          </View>
          <Text>Write review:</Text>
          <TextInput
            style={styles.reviewForm}
            placeholder="Your Thoughts"
            placeholderTextColor={"#777777"}
            value={reviewText}
            onChangeText={(text) => setReviewText(text)}
          />
          <TouchableRipple
            style={styles.submitButton}
            onPress={() => {
              readData();
              writeReview(jobid, userID, rating, reviewText);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
          </TouchableRipple>
        </View>
      </View>
      <View style={styles.pastReviews}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>
          Reviews:
        </Text>
        {reviews.length === 0 ? (
          <Text style={{ textAlign: "center", fontSize: 16, marginTop: 20 }}>
            No reviews available
          </Text>
        ) : (
          <FlatList
            data={reviews}
            renderItem={renderItem}
            keyExtractor={(item) => item?.timestamp}
            showsVerticalScrollIndicator={false}
            inverted={true}
            style={styles.reviewList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9ce40",
  },
  reviewForm: {
    backgroundColor: "#EBEBEB",
    paddingTop: 5,
    marginTop: 10,
    elevation: 5,
    paddingLeft: 10,
    paddingBottom: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  ratingSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  reviewSection: {
    width: "90%",
    backgroundColor: "white",
    padding: 10,
    elevation: 10,
    marginVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  submitButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1a1918",
    borderRadius: 10,
    marginVertical: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 5,
  },
  pastReviews: {
    marginTop: -50,
    height: "auto",

    backgroundColor: "#f9ce40",
  },
  reviewList: {},
});
