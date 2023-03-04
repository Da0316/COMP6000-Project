import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

//data can be passed between react screens and components using props or routes
const ViewJob = ({ ID }) => {
  const [jobID, setjobID] = useState("");
  const [jobTitle, setjobTilte] = useState("");
  const [jobDescription, setjobDescription] = useState("");
  const [price, setprice] = useState("");
  const [image, setImage] = useState(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/images/1.jpg"
  );

  //fetch data for the job from the database
  //need to create an API for this
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/postThumbnail.php",
      {
        //needs to be changed to your own ip
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobID: ID,
          job_Description: "",
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setjobID(responseJson[0]);
        setjobTilte(responseJson[1]);
        setjobDescription(responseJson[2]);
        setprice(responseJson[3]);
        if (responseJson[4] == null) {
          setImage(
            "https://raptor.kent.ac.uk/proj/comp6000/project/08/images/1.jpg"
          );
        } else {
          setImage(
            "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/" +
              responseJson[4]
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const nav = useNavigation();
  const showJob = () => nav.navigate("Job", { jobID }); //passes data to the job page using a route

  return (
    <TouchableOpacity onPress={showJob}>
      <View style={styles.container}>
        {/* image */}
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          {/* title */}
          <Text style={styles.title}>{jobTitle}</Text>

          {/* description*/}
          <Text style={styles.description}>{jobDescription}</Text>
        </View>
        {/* amount */}
        <Text style={styles.amount}>£{price}/h </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ViewJob;

const styles = StyleSheet.create({
  container: {
    width: 150,
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: "#EBEBEB",
    marginVertical: 15,
    marginHorizontal: 8,
  },
  image: {
    height: 150,
    width: 150,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  info: {
    padding: 10,
    height: 100,
    backgroundColor: "#EBEBEB",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 6,
  },
  amount: {
    fontSize: 14,
    alignSelf: "flex-end",
    fontWeight: "bold",
    //color:"#0077B6",
    marginBottom: 10,
    marginEnd: 15,
  },
});
