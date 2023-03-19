import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

function Job({ route, navigation }) {
  // Get jobID from navigation params
  const { jobID } = route.params;

  // Define state variables to hold job information
  const [userPostedID, setUserPostedID] = useState(null);
  const [speciality, setSpeciality] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [postedDate, setPostedDate] = useState(null);
  const [price, setPrice] = useState(null);
  const [username, setUsername] = useState(null);
  const [sameUser, setSameUser] = useState(null);
  const [image, setImage] = useState("https://raptor.kent.ac.uk/proj/comp6000/project/08/images/1.jpg");

  //  fetch job data from server
 // useEffect(() = {})
    try {
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/job.php", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          jobID: jobID,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // Update state variables with job information
          setUserPostedID(responseJson[0]);
          setSpeciality(responseJson[1]);
          setJobTitle(responseJson[2]);
          setJobDescription(responseJson[3]);
          setPostedDate(responseJson[4]);
          setPrice(responseJson[7]);
          setUsername(responseJson[8]);
          if (userPostedID == global.userID) {
            setSameUser(true);
          } else {
            setSameUser(false);
          }

          if (responseJson[9] == null){
            setImage("https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/1.jpeg");
          }else{
            setImage("https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/" + responseJson[9]);
          }

          
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  // Render different buttons based on whether the logged in 
  //user is the same as the user who posted the job
  const renderButton = () => {
    if (sameUser == false) {
      return (
        <TouchableOpacity
          testID="create-application-button"
          styles={styles.applicationButton}
          onPress={() => navigation.navigate("CreateApplication", { jobID })}
        >
          <Text style={styles.btnTxt}>Create Application</Text>
        </TouchableOpacity>
      );
    } else if (sameUser == true) {
      return (
        <TouchableOpacity
          styles={styles.applicationButton}
          onPress={() =>
            navigation.navigate("JobApplications", { jobID, jobTitle })
          }
        >
          <Text style={styles.btnTxt}>View Applications</Text>
        </TouchableOpacity>
      );
    }
  };
 // Render different views based on whether
 // the logged in user is the same as the user who posted the job
  const profileView = () => {
    if (sameUser == false) {
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate("ViewProfile", {
              paramKey: userPostedID,
              jobID: jobID,
            })
          }
        >
          <Text style={styles.btn}> {username}</Text>
        </TouchableOpacity>
      );
    } else {
      return <Text style={styles.answer}> You</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.information}>

        <Text testID="title" style={styles.title}>{jobTitle}</Text>
        <View style={styles.row}>
          <Text testID='description' style={styles.des}>{jobDescription}</Text>
        </View>
        <View style={styles.row}>
          <Text testID='user' style={styles.answer}> 
          Posted by: {profileView()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.baseText}>
            <Text testID='speciality' style={styles.answer}>Speciality: {speciality}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.baseText}>
            <Text testID='date' style={styles.answer}>Date Posted: {postedDate}</Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.baseText}>
            <Text testID='rate' style={styles.answer}>Hourly rate: £{price}</Text>
          </Text>
        </View>
        <View>
          <Image
            source={{
              uri: image,
            }}
            opacity={0.7} //change opacity 
            style={styles.image}
            testID="job_image"
          />
        </View>
      </View>
      <View style={styles.lower}>
        <View style={styles.applicationButton}>{renderButton()}</View>
      </View>
    </View>
  );
}

export default Job;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  applicationButton: {
    alignItems: "center",
    width: "90%",
    flex: 1,
    height: 30,
    backgroundColor: "#1a1918",
    borderRadius: 20,
    marginVertical: 10,
    justifyContent: "center",
    alignSelf: "center",
    elevation: 5,
  },
  information: {
    flex: 12,
    justifyContent: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "#f9ce40",
    borderBottomEndRadius: 100,
    borderBottomLeftRadius: 100,
  },
  row: {
    marginVertical: 12,
  },
  baseText: {
    alignContent: "center",
    fontWeight: "bold",
    paddingVertical: 3,
  },
  des: {
    alignSelf: "center",
    marginVertical: -5,
    opacity: 0.5,
    paddingBottom: 20,
  },
  lower: {
    flex: 2,
    backgroundColor: "#fff",
  },
  btnTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  answer: {
    fontWeight: "400",
    alignContent: "center",
  },
  btn: {
    fontWeight: "400",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    marginBottom: -3,
  },
  image: {
    height: '60%',
    width: '100%',
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
  },
});
