//chat.js - chat screen page between two users
//imports
import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { getDatabase, get, ref, onValue, off, update } from "firebase/database";

//Main chat function that takes with parameters
//@param onBack, function that goes back to the User's page
//@param myData, user logged in's data
//@param selectedUser, user click on's data
//@param viewUser, fucntion that redirects to viewUser page
//@param leaveReview, function that redirects to leaveReview page
function Chat({ onBack, myData, selectedUser, viewUser, leaveReview }) {
  //useStates needed
  const [messages, setMessages] = useState([]);
  const [hostUser, setHostUser] = useState(null);
  const [jobCompleted, setJobCompleted] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [firstUser, setFirstUser] = useState(null);
  const [secondUser, setSecondUser] = useState(null);
  const [userPostingReview, setUserPostingReview] = useState(null);
  const [reviewLeft, setReviewLeft] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [jobRejected, setJobRejected] = useState(null);

  //useEffect that loads all the data for the chat
  useEffect(() => {
    const database = getDatabase();
    const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
    const loadData = async () => {
      const myChatroom = await fetchMessages();

      setJobID(myChatroom.jobID);
      setFirstUser(myChatroom.firstUser);
      setSecondUser(myChatroom.secondUser);
      setMessages(renderMessages(myChatroom.messages));
    };

    loadData();

    // set chatroom change listener
    onValue(chatroomRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(renderMessages(data.messages));
    });

    return () => {
      //remove chatroom listener
      off(chatroomRef);
    };
    //refreshes when messages change
  }, [fetchMessages, renderMessages, selectedUser.chatroomId]);

  //function that renders all the messages in the chatroom
  const renderMessages = useCallback(
    (msgs) => {
      return msgs
        ? msgs.reverse().map((msg, index) => ({
            ...msg,
            _id: index,
            user: {
              _id:
                msg.sender === myData.username
                  ? myData.username
                  : selectedUser.username,
              avatar:
                msg.sender === myData.username
                  ? myData.avatar
                  : selectedUser.avatar,
              name:
                msg.sender === myData.username
                  ? myData.username
                  : selectedUser.username,
            },
          }))
        : [];
    },
    [myData.avatar, myData.username, selectedUser.avatar, selectedUser.username]
  );

  //function that gets all the messages in the chat
  const fetchMessages = useCallback(async () => {
    const database = getDatabase();

    const snapshot = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId)
    );

    return snapshot.val();
  }, [selectedUser.chatroomId]);

  //function that sends a message to the chat, updates in the firebase
  const onSend = useCallback(
    async (msg = []) => {
      //send the msg[0] to the other user
      const database = getDatabase();

      //fetch fresh messages from server
      const currentChatroom = await fetchMessages();

      const lastMessages = currentChatroom.messages || [];

      //adds the message to the database
      update(ref(database, `chatrooms/` + selectedUser.chatroomId), {
        messages: [
          ...lastMessages,
          {
            text: msg[0].text,
            sender: myData.username,
            createdAt: new Date(),
          },
        ],
      });

      //sets messages to state
      setMessages((prevMessages) => GiftedChat.append(prevMessages, msg));
    },
    [fetchMessages, myData.username, selectedUser.chatroomId]
  );

  //useEffect that checks if the host user has removed selected user from the current job
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/checkReject.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        //backend params
        body: JSON.stringify({
          jobID: jobID,
          userIDLoggedIn: global.userID,
          userNameOtherUser: selectedUser.username,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //if host user hasn't removed that user from the job
        if (responseJson == 1) {
          setJobRejected(false);
          //if host user has removed that user from the job
        } else if (responseJson == -1) {
          setJobRejected(true);
        }
      })
      //catches errors
      .catch((error) => {
        console.log(error);
      });
    //refreshes when messages is changed
  }, [messages]);

  //function that shows the pop up when host user wants to mark the job as completed
  const showConfirmationPopup = () => {
    //hides the modal
    setModalVisible(!modalVisible);
    return Alert.alert(
      "Job Completed?",
      "Are you sure the job has been completed.",
      [
        {
          text: "Yes",
          //calls handleJobCompleted() if yes is clicked
          onPress: () => {
            handleJobCompleted();
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  //function that shows the pop up when host user wants to remove the other user from the job
  const showDeleteConfirmationPopup = () => {
    setModalVisible(!modalVisible);
    return Alert.alert(
      "Remove User From Job?",
      "Are you sure you want to remove this user from the job?",
      [
        {
          text: "Yes",
          //calls removeUser() if yes is selected
          onPress: () => {
            removeUser();
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  //function that checks if reviews have already been left by the logged in user on the selected user
  const checkPriorReview = async () => {
    await fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/checkPriorReview.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        //backend params
        body: JSON.stringify({
          jobID: jobID,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //sets variable to true if review has already been left for this job
        if (responseJson == true) {
          setReviewLeft(true);
          //sets variable to false if review hasn't aleady been left for this job
        } else if (responseJson == false) {
          setReviewLeft(false);
        }
      })
      //catches errors
      .catch((error) => {
        console.log(error);
      });
  };

  //function that renders the review part of the screen
  const review = () => {
    //checks if review has been left
    checkPriorReview();
    //if review has been left
    if (reviewLeft) {
      return [
        <Text key="1" style={styles.text}>
          Review Left
        </Text>,
      ];
      //if review hasn't been left
    } else {
      return [
        //button to leave a review
        <TouchableOpacity
          key="1"
          onPress={() => leaveReview(jobID, userPostingReview)}
        >
          <Text style={styles.text}>Leave a Review?</Text>
        </TouchableOpacity>,
      ];
    }
  };

  //function that handles if host user marks the job as complete
  const handleJobCompleted = async () => {
    //loads database
    const database = getDatabase();
    //gets the chatroom
    const chatroomRef = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId)
    );

    //gets the job ID
    const jobID = chatroomRef.val().jobID;

    //gets the messages
    const currentChatroom = await fetchMessages();

    const lastMessages = currentChatroom.messages || [];

    //updates the chatroom with a message indicating that the job has been completed
    update(ref(database, `chatrooms/` + selectedUser.chatroomId), {
      messages: [
        ...lastMessages,
        {
          text: "Job has been complete. Thank you!",
          sender: myData.username,
          createdAt: new Date(),
        },
      ],
    });
    try {
      //fetch to update the job status to complete
      await fetch(
        "https://raptor.kent.ac.uk/proj/comp6000/project/08/jobComplete.php",
        {
          method: "post",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          //backend params
          body: JSON.stringify({
            jobID: jobID,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          //checks for an error
          if (responseJson == -1) {
            console.log("error");
          }
        })
        //catches errors
        .catch((error) => {
          console.log(error);
        });
      //catches errors
    } catch {
      console.log(error);
    }
  };

  //function to remove a user from the job
  const removeUser = async () => {
    //loads the database
    const database = getDatabase();

    //gets the chatroom
    const chatroomRef = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId)
    );

    //gets the jobID
    const jobID = chatroomRef.val().jobID;

    //gets the messages
    const currentChatroom = await fetchMessages();

    const lastMessages = currentChatroom.messages || [];

    //sends a new message indication that the use has been removed from the job
    update(ref(database, `chatrooms/` + selectedUser.chatroomId), {
      messages: [
        ...lastMessages,
        {
          text:
            selectedUser.username +
            " has been removed from the job, applications have reopened.",
          sender: myData.username,
          createdAt: new Date(),
        },
      ],
    });
    try {
      //fetch call to updates the database and remove the user
      await fetch(
        "https://raptor.kent.ac.uk/proj/comp6000/project/08/removeUser.php",
        {
          method: "post",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          //backend params
          body: JSON.stringify({
            jobID: jobID,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          //checks if an error occured removing the user
          if (responseJson == "error") {
            console.log("error");
            //alerts if user was removed successfully
          } else {
            Alert("User removed successfully!");
          }
        })
        //catches errors
        .catch((error) => {
          console.log(error);
        });
    } catch {
      console.log(error);
    }
  };

  //function to find a userID given a username
  const findUserID = (uname) => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/chatViewUser.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        //backed param
        body: JSON.stringify({
          username: uname,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //sets the userPostingID
        setUserPostingReview(responseJson);
      })
      //catches errors
      .catch((error) => {
        console.log(error);
      });
  };

  //fetch call that gets the username to check if the the userLogged in is the host user
  fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
    method: "post",
    header: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    //backend params
    body: JSON.stringify({
      userID: global.userID,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      //if host user is loggedIn
      if (responseJson[1] == firstUser) {
        setHostUser(true);
        findUserID(secondUser);
        //if other user is loggedIn
      } else {
        setHostUser(false);
        findUserID(firstUser);
      }
    })
    //catches errors
    .catch((error) => {
      console.log(error);
    });

  //checks if jobID has been set before running fetch call
  if (jobID != null) {
    //checks if the job has been completed already
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/job.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      //backend params
      body: JSON.stringify({
        jobID: jobID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //if job has been completed already
        if (responseJson[6] == 1) {
          setJobCompleted(true);
          //if job has not been completed
        } else if (responseJson[6] == 0) {
          setJobCompleted(false);
        }
      })
      //catches errors
      .catch((error) => {
        console.log(error);
      });
  }

  //if statemetents that dictates what version of the chat to load
  if (jobRejected == false) {
    if (jobCompleted != null) {
      if (hostUser == true) {
        if (jobCompleted == false) {
          //chatscreen for if the user hasnt been removed from the job, if the job hasnt been completed and if the host user is logged in
          return (
            <>
              {/* Modal for options */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {/* to complete a task */}
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={showConfirmationPopup}
                    >
                      <Text style={styles.textStyle}>Job Completed?</Text>
                    </Pressable>
                    {/* To delete user from job */}
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={showDeleteConfirmationPopup}
                    >
                      <Text style={styles.textStyle}>Remove User From Job</Text>
                    </Pressable>
                    {/* to close modal */}
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <View style={styles.actionBar}>
                {/* Button to go back a page */}
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                {/* button with username and profile pic, redirects to viewUser information */}
                <TouchableOpacity style={styles.username} onPress={viewUser}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: selectedUser.avatar }}
                  />
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
                {/* options button to display modal */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={require("./assets/options.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>
              {/* gifted chat component to dispaly messages */}
              <GiftedChat
                messages={messages}
                onSend={(newMessage) => onSend(newMessage)}
                user={{
                  _id: myData.username,
                }}
              />
            </>
          );
        } else if (jobCompleted == true) {
          // if user hasn't beed removed from the job, job has been completed and host user is logged in
          return (
            <>
              <View style={styles.actionBar}>
                {/* back button */}
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                {/* button with username and image */}
                <TouchableOpacity style={styles.username} onPress={viewUser}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: selectedUser.avatar }}
                  />
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
                {/* view that renders the leave review button */}
                <View>{review()}</View>
              </View>
              {/* gifted chat component for the messages */}
              <GiftedChat
                messages={messages}
                onSend={(newMessage) => onSend(newMessage)}
                user={{
                  _id: myData.username,
                }}
              />
            </>
          );
        }
      } else if (hostUser == false) {
        if (jobCompleted == false) {
          // if other user hasn't been removed, if host user isn't logged in and if the job hasnt been completed
          return (
            <>
              <View style={styles.actionBar}>
                {/* back button */}
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                {/* button with username and profile picture */}
                <TouchableOpacity style={styles.username} onPress={viewUser}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: selectedUser.avatar }}
                  />
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
              </View>
              {/* gifted chat component for messages */}
              <GiftedChat
                messages={messages}
                onSend={(newMessage) => onSend(newMessage)}
                user={{
                  _id: myData.username,
                }}
              />
            </>
          );
        } else if (jobCompleted == true) {
          // if other user hasn't been removed, host user isn't logged in and the job has been completed
          return (
            <>
              <View style={styles.actionBar}>
                {/* back button */}
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                {/* button with username and profile picture */}
                <TouchableOpacity style={styles.username} onPress={viewUser}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: selectedUser.avatar }}
                  />
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
                {/* view to render the review component  */}
                <View>{review()}</View>
              </View>
              {/* gifted chat component for messages */}
              <GiftedChat
                messages={messages}
                onSend={(newMessage) => onSend(newMessage)}
                user={{
                  _id: myData.username,
                }}
              />
            </>
          );
        }
      }
    }
  } else if (jobRejected == true) {
    // if user has been removed from the job
    return (
      <>
        <View style={styles.actionBar}>
          {/* back button */}
          <TouchableOpacity onPress={onBack}>
            <Image source={require("./assets/back.png")} />
          </TouchableOpacity>
          {/* viewing user information */}
          <TouchableOpacity style={styles.username} onPress={viewUser}>
            <Image
              style={styles.avatar}
              source={{ uri: selectedUser.avatar }}
            />
            <Text style={styles.text}>{selectedUser.username}</Text>
          </TouchableOpacity>
        </View>
        {/* gifted chat component for messages */}
        <GiftedChat
          messages={messages}
          onSend={(newMessage) => onSend(newMessage)}
          user={{
            _id: myData.username,
          }}
        />
      </>
    );
  }
}

export default Chat;

//css styling
const styles = StyleSheet.create({
  actionBar: {
    backgroundColor: "#cacaca",
    height: 41,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
