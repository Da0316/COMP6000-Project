import React, {useEffect, useState} from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { Avatar, Title, Caption, Text, TouchableRipple} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

export default function LeaveReview({jobID, userPostedID}){
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviews, setReview] = useState([]);
    const [write, setWrite] = useState([]);
    const [userID, setUserID] = useState("");
    const isFocused = useIsFocused();
    const [jobid, setJobId] = useState(route?.params?.jobId);

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
      const fetchReview = async () => {
        const params = new FormData();
        params.append("jobid", jobid);
        params.append("type", "post");
        params.append("userposted",jobid)
        console.log("params", params);
        const res = await axios.post(
          `https://raptor.kent.ac.uk/proj/comp6000/project/08/reviews.php`,
          params
        );
        setReview(res?.data);
        console.log("res", res.data);
      };
      const writeReview = async (jobid, userid, rating, reviewtxt) => {
        const params = new FormData();
        params.append("jobid", jobid);
        params.append("userID", userid);
        params.append("review_text", reviewtxt);
        params.append("userposted",userPostedID)
        params.append("rating", rating);
    
        console.log("params", params);
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
        console.log("res", res.data);
      };
      useEffect(() => {
        readData();
        fetchReview();
      }, [write, isFocused]);
      const renderItem = ({ item }) => {
        return (
          <View style={{ marginBottom: 20, elevation: 1, padding: 10 }}>
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
                  width: 50,
                  height: 50,
                  borderRadius: 50 / 2,
                  overflow: "hidden",
                  borderWidth: 1,
                }}
              />
              <View>
                <Text
                  style={{
                    width: "70%",
                    marginLeft: 10,
                    fontSize: 16,
                  }}
                >
                  {item?.username}
                </Text>
                <Text
                  style={{
                    width: "70%",
                    marginLeft: 10,
                    fontSize: 16,
                  }}
                >
                  Ratings {item?.rating}
                </Text>
                <Text
                  style={{
                    width: "90%",
                    marginLeft: 10,
                    fontSize: 16,
                  }}
                >
                  {item?.timestamp}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                marginTop: 10,
                marginHorizontal: 40,
              }}
            >
              <Text style={{ width: "70%", textAlign: "center", padding: 10 }}>
                {item?.review_text}
              </Text>
            </View>
          </View>
        );
      };
      return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
              <View style={{ height: "52%", backgroundColor: "lightgray" }}>
                  <FlatList
                    data={reviews}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    inverted={true}
                  />
                </View>
                <View style={styles.reviewSection}>
                  <Title style={{ fontWeight: "bold", marginLeft: 20 }}>
                    Write a Review
                  </Title>
                  <Text>Your Rating:</Text>
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
                  <TextInput
                    style={styles.reviewForm}
                    placeholder="Write Review"
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
                    <Text>Submit</Text>
                  </TouchableRipple>
                </View>
              </View>
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      main:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        margin:5,
    
      }
      ,container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#F3F3F3",
      },
      reviewForm: {
        backgroundColor: "white",
        paddingTop: 10,
        marginTop: 20,
        paddingBottom: 50,
      },
      ratingSection: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical:5
      },
      reviewSection: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius:20,
        borderBottomLeftRadius:20
      },
      submitButton: {
        width: "90%",
        height: 50,
        backgroundColor: "#f9ce40",
        borderRadius: 10,
        marginVertical: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        elevation: 5,
      },
    });
