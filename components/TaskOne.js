import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

const TaskOne = () => {
  return (
    <View style={styles.container}>
      {/* image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1531617494862-4e322fb560c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nJTIwd2Fsa2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60",
        }}
        style={styles.image}
      />
      <View style={{ padding: 20 }}>
        {/* title */}
        <Text style={styles.title}>Dog walking</Text>

        {/* description*/}
        <Text style={styles.description}>
          I'm Looking for a dog-lover to walk my dog 3 times a week near my
          area.
        </Text>

        {/* amount */}
        <Text style={styles.amount}>£12.00/h </Text>
      </View>
    </View>
  );
};

export default TaskOne;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: "#EDF6F9",
    marginTop: 20,
  },
  image: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
  amount: {
    fontSize: 14,
    alignSelf: "flex-end",
    fontWeight: "bold",
    color: "#0077B6",
    marginTop: 10,
  },
});
