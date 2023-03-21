//jobApplication.js -- page for applications for a certain job
//imports
import { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import ViewApplication from "../components/ViewApplication";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Main function that takes route as params, including the jobID and jobTitle
function JobApplications({ route }) {
  //useState and other variables for the page
  const { jobID: jobID } = route.params;
  const [applications, setApplications] = useState([]);
  const [isApplicationEmpty, setIsApplicationEmpty] = useState(null);
  const { jobTitle: jobTitle } = route.params;

  //useEffect to get the applications for a job
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobApplications.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //backend jobID param
        body: JSON.stringify({
          id: jobID,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //if there are no applications for this job
        if (responseJson == -1) {
          //set empty to true
          setIsApplicationEmpty(true);
        //if applications exist
        } else {
          setIsApplicationEmpty(false);
          const ids = [];
          let acceptedFound = false;
          //loops torugh all returned applications
          for (let i = 0; i < responseJson.length; i += 2) {
            //checks if application hasnt been rejected
            if (responseJson[i + 1] != "-1") {
              //if application is accepted and accepted application hasnt been found yet
              if (responseJson[i + 1] == "1" && acceptedFound == false) {
                //set accepted to true and create new object
                acceptedFound = true;
                let object = {
                  id: responseJson[i],
                  status: responseJson[i + 1],
                };
                ids.push(object);
              }
              //if accepted hasn't been found yet
              if (acceptedFound == false) {
                //create new object
                let object = {
                  id: responseJson[i],
                  status: responseJson[i + 1],
                };
                ids.push(object);
              }
            }
          }
          // add applications to application useState
          setApplications(ids);
        }
      })
      .catch((error) => {
        alert(error);
      });
    return () => {};
    //reruns when route is changed
  }, [route]);

  //main return components depending on empty state
  // if there are applications
  if (isApplicationEmpty == false) {
    return (
      <View style={styles.result1}>
        <View style={styles.upper}>
          {/* title */}
          <Text style={styles.title}>{jobTitle} Applications</Text>
        </View>
        <ScrollView>
          {/*  applications in a scrollview, callign the ViewApplication component*/}
          {applications.map((object) => {
            return (
              <ViewApplication
                key={object.id}
                ID={object.id}
                type={"jobApps"}
                style={styles.app}
              />
            );
          })}
        </ScrollView>
      </View>
    );
    //if there are no applications
  } else if (isApplicationEmpty == true) {
    return (
      <View style={styles.result2}>
        <Icon
          name="clipboard-text-multiple-outline"
          color="#f9ce40"
          size={40}
        />
        {/* no applications */}
        <Text style={styles.noApplications}>No Applications yet!</Text>
        <Text>Wait for users to apply for this job</Text>
      </View>
    );
  }
}

export default JobApplications;

//CSS styling
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#1a1918",
    fontFamily: "sans-serif-medium",
    shadowColor: "000",
  },
  upper: {
    width: "100%",
    height: "16%",
    backgroundColor: "#f9ce40",
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    elevation: 5,
  },
  result2: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  result1: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 2,
    width: "100%",
    height: "84%",
  },
  noApplications: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  app: {
    backgroundColor: "#f9ce40",
  },
});
