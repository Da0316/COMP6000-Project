import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet, ScrollView, TextInput } from "react-native";
import { Avatar, Title, Caption, Text, TouchableRipple } from "react-native-paper";

const Reviews = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    // Submit the review to the database
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.reviewSection}>
          <Title style={{ fontWeight: "bold", marginLeft: 20 }}>Write a Review</Title>
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
            onChangeText={text => setReviewText(text)}
          />
          <TouchableRipple style={styles.submitButton} onPress={handleSubmit}>
            <Text>Submit</Text>
          </TouchableRipple>
        </View>
       </View>
    </SafeAreaView>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: "#F3F3F3"
  },
  main:{
    flex:1,
    //height:"50%",
    //position:"absolute",
    //justifyContent:"flex-start",
    justifyContent: "center",
    alignItems: "center",
    margin:5,

  },
  reviewForm:{
    backgroundColor: "white",
    paddingTop:10,
    marginTop:20,
    paddingBottom:50,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: "center",
    marginVertical:5
  },
  reviewSection: {
    //position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
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
    alignSelf:"center",
    elevation: 5,
  }
});