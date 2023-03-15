//application.js - page for viewing an application
//imports
import { useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { getDatabase, get, ref, update, push } from "firebase/database";

function Application({ route, navigation }) {
  //all data from teh params, and a usernameApplied useState
  const { ID: applicationID } = route.params;
  const [usernameApplied, setUsernameApplied] = useState("");
  const { price: priceOffer } = route.params;
  const { date: applicationDate } = route.params;
  const { statusNum: applicationStatus } = route.params;
  const { userApplicationID: userAppID } = route.params;
  const { jobTitle: jTitle } = route.params;
  const { jobID: jobID } = route.params;

  //fetch to get the data of the username of the user who applied
  try {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userID: userAppID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUsernameApplied(responseJson[1]);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }

  //function thats called when user accepts the application
  const onAddFriend = async () => {
    //fetch that gets the username of the user who is logged in
    try {
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        //userID parameter for backend
        body: JSON.stringify({
          userID: global.userID,
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          //sets the username of the user who is logged in
          let usernameLoggedIn = responseJson[1];
          //firebase database set
          const database = getDatabase();

          //gets the user who applied's details from the firebase database
          const userAppliedSnapShot = await get(
            ref(database, "users/" + usernameApplied)
          );
          const userApplied = userAppliedSnapShot.val();

          //gets the logged in user's details from the firebase database
          const userLoggedInSnapShot = await get(
            ref(database, "users/" + usernameLoggedIn)
          );
          const userLoggedIn = userLoggedInSnapShot.val();

          let found = false;
          const foundChatroomkey = null;
          const chatroomsSnapshot = await get(ref(database, "chatrooms/"));

          //loops through all the existing chatrooms
          chatroomsSnapshot.forEach((childSnapshot) => {
            const chatroom = childSnapshot.val();
            //checks if the two users have a chatroom together
            if (
              (userApplied.username == chatroom.firstUser &&
                userLoggedIn.username == chatroom.secondUser) ||
              (userApplied.username == chatroom.secondUser &&
                userLoggedIn.username == chatroom.firstUser)
            ) {
              //udpates their chatroom and sets found to true
              found = true;
              //gets previous messages
              const lastMessages = chatroom.messages || [];
              //sends a new message to the chatroom
              update(ref(database, "chatrooms/" + childSnapshot.key), {
                messages: [
                  ...lastMessages,
                  {
                    text:
                      usernameLoggedIn +
                      " has accepted your application for '" +
                      jTitle +
                      "' at the rate of £" +
                      priceOffer +
                      "/hr. Discuss a suitable dates and time!",
                    sender: userLoggedIn.username,
                    createdAt: new Date(),
                  },
                ],
              });

              //updates the jobID for the chatroom
              update(ref(database, "chatrooms/" + childSnapshot.key), {
                jobID: jobID,
              });
              //sets first user and second user in firebase if old host is now the user who applied
              if (chatroom.firstUser != userLoggedIn.username) {
                update(ref(database, "chatrooms/" + childSnapshot.key), {
                  firstUser: userLoggedIn.username,
                  secondUser: userApplied.username,
                });
              }
            }
          });

          //if no chatroom was found between the two users
          if (found == false) {
            //create a new chatroom with all the data
            const newChatRoomRef = push(ref(database, "chatrooms"), {
              firstUser: userLoggedIn.username,
              secondUser: userApplied.username,
              messages: [],
              jobID: jobID,
            });

            const newChatroomID = newChatRoomRef.key;
            const userAppliedFriends = userApplied.friends || [];

            //adding user logged in as a friend to the user applied in the firebase database
            update(ref(database, "users/" + userApplied.username), {
              friends: [
                ...userAppliedFriends,
                {
                  username: userLoggedIn.username,
                  avatar: userLoggedIn.avatar,
                  chatroomId: newChatroomID,
                },
              ],
            });

            const myFriends = userLoggedIn.friends || [];

            //adding the user applied as a friend to the user logged in in the database
            update(ref(database, "users/" + userLoggedIn.username), {
              friends: [
                ...myFriends,
                {
                  username: userApplied.username,
                  avatar: userApplied.avatar,
                  chatroomId: newChatroomID,
                },
              ],
            });

            //creating a new message for the chatroom
            update(ref(database, "chatrooms/" + newChatroomID), {
              messages: [
                {
                  text:
                    usernameLoggedIn +
                    " has accepted your application for '" +
                    jTitle +
                    "' at the rate of £" +
                    priceOffer +
                    "/hr. Discuss a suitable dates and time!",
                  sender: userLoggedIn.username,
                  createdAt: new Date(),
                },
              ],
            });
          } else if (found == true) {
            update(ref(database, "chatrooms/" + foundChatroomkey), {
              messages: [
                {
                  text:
                    usernameLoggedIn +
                    " has accepted your application for '" +
                    jTitle +
                    "' at the rate of £" +
                    priceOffer +
                    "/hr. Discuss a suitable dates and time!",
                  sender: userLoggedIn.username,
                  createdAt: new Date(),
                },
              ],
            });
          }
        })
        //catching error
        .catch((error) => {
          console.log(error);
        });
      //catching error
    } catch (error) {
      console.log(error);
    }
  };

  //function that takes the choice in as a parameter and makes
  const handleAction = (choice) => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/acceptReject.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //parameters for the backend
        body: JSON.stringify({
          applicationID: applicationID,
          choice: choice,
          priceOffer: priceOffer,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //if application was accepted successfully
        if (responseJson == 1 && choice == "Accept") {
          //alert for the user
          alert("Application Accepted, Chatroom opened!");
          //calls onAddFriend() to create all necessary firebase changes
          onAddFriend();
          //navigates to HomeScreen
          navigation.navigate("HomeScreen");
          //if application was rejected successfully
        } else if (responseJson == 1 && choice == "Reject") {
          //alert user
          alert("Application Rejected");
          //navigates back to the applications
          navigation.navigate("JobApplications", { jobID });
          //if error occurs
        } else if (responseJson == -1) {
          alert("error");
        }
      })
      //catching errors
      .catch((error) => {
        alert(error);
      });
  };

  //function that returns the button for the username, that navigates to viewing the user's page when pressed
  const profileView = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ViewProfile", {
            paramKey: userAppID,
            jobID: jobID,
          })
        }
      >
        <Text style={styles.btn}>{usernameApplied}</Text>
      </TouchableOpacity>
    );
  };

  //if the applications status is pending 
  if (applicationStatus == 0) {
    return (
      <View style={styles.mainView}>
        <View style={styles.infoBox}>
          {/* displays username */}
          <Text style={styles.infoTxt}>Username: {profileView()}</Text>
          {/* displays application date */}
          <Text style={styles.infoTxt}>
            Application Date: {applicationDate}
          </Text>
          {/* displays price offered */}
          <Text style={styles.infoTxt}>Price Offered: ${priceOffer}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* accept button */}
          <View style={styles.button}>
            <Button
              title="Accept"
              color="green"
              onPress={() => handleAction("Accept")}
            />
          </View>
          {/* reject button */}
          <View style={styles.button}>
            <Button
              title="Reject"
              color="red"
              onPress={() => handleAction("Reject")}
            />
          </View>
        </View>
      </View>
    );
  } else if (applicationStatus == 1) {
    return (
      <View style={styles.mainView}>
        <View style={styles.infoBox}>
          {/* displays username */}
          <Text style={styles.infoTxt}>Username: {profileView()}</Text>
          {/* displays application date */}
          <Text style={styles.infoTxt}>
            Application Date:{" "}
            <Text style={styles.answer}>{applicationDate}</Text>
          </Text>
          {/* displays price offered */}
          <Text style={styles.infoTxt}>
            Price Offered: <Text style={styles.answer}>${priceOffer}</Text>
          </Text>
          <Text style={styles.infoTxt}>
            {/* accepted application */}
            <Text style={styles.answer}>Accepted</Text>
          </Text>
        </View>
      </View>
    );
  } else if (applicationStatus == -1) {
    return (
      <View style={styles.mainView}>
        <View style={styles.infoBox}>
          {/* displays username */}
          <Text style={styles.infoTxt}>Username: {profileView()}</Text>
          {/* displays application date */}
          <Text style={styles.infoTxt}>
            Application Date: <Text style={styles.answer}></Text>
            {applicationDate}
          </Text>
          {/* displays price offered */}
          <Text style={styles.infoTxt}>
            Price Offered: <Text style={styles.answer}></Text>${priceOffer}
          </Text>
          {/* displays rejected */}
          <Text style={styles.infoTxt}>
            <Text style={styles.answer}>Rejected</Text>
          </Text>
        </View>
      </View>
    );
  }
}

export default Application;

//css styling
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  button: {
    flex: 1,
    margin: 50,
    elevation: 10,
    borderCurve: 10,
  },
  mainView: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  infoBox: {
    width: "80%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 20,
    backgroundColor: "#f9ce40",
    borderTopEndRadius: 70,
    borderTopLeftRadius: 70,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    elevation: 12,
  },
  infoTxt: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: "bold",
  },
  btn: {
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: -5,
  },
});
