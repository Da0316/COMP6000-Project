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

function Chat({ onBack, myData, selectedUser, viewUser, leaveReview }) {
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
  }, [fetchMessages, renderMessages, selectedUser.chatroomId]);

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

  const fetchMessages = useCallback(async () => {
    const database = getDatabase();

    const snapshot = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId)
    );

    return snapshot.val();
  }, [selectedUser.chatroomId]);

  const onSend = useCallback(
    async (msg = []) => {
      //send the msg[0] to the other user
      const database = getDatabase();

      //fetch fresh messages from server
      const currentChatroom = await fetchMessages();

      const lastMessages = currentChatroom.messages || [];

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

      setMessages((prevMessages) => GiftedChat.append(prevMessages, msg));
    },
    [fetchMessages, myData.username, selectedUser.chatroomId]
  );

  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/checkReject.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          jobID: jobID,
          userIDLoggedIn: global.userID,
          userNameOtherUser: selectedUser.username,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          setJobRejected(false);
        } else if (responseJson == -1) {
          setJobRejected(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [messages]);

  const showConfirmationPopup = () => {
    setModalVisible(!modalVisible);
    return Alert.alert(
      "Job Completed?",
      "Are you sure the job has been completed. The chat will be deleted",
      [
        {
          text: "Yes",
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

  const showDeleteConfirmationPopup = () => {
    setModalVisible(!modalVisible);
    return Alert.alert(
      "Remove User From Job?",
      "Are you sure you want to remove this user from the job?",
      [
        {
          text: "Yes",
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

  const checkPriorReview = async () => {
    await fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/checkPriorReview.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          jobID: jobID,
          user,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == true) {
          setReviewLeft(true);
        } else if (responseJson == false) {
          setReviewLeft(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const review = () => {
    checkPriorReview();
    if (reviewLeft) {
      return [
        <Text key="1" style={styles.text}>
          Review Left
        </Text>,
      ];
    } else {
      return [
        <TouchableOpacity
          key="1"
          onPress={() => leaveReview(jobID, userPostingReview)}
        >
          <Text style={styles.text}>Leave a Review?</Text>
        </TouchableOpacity>,
      ];
    }
  };

  const handleJobCompleted = async () => {
    const database = getDatabase();
    const chatroomRef = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId)
    );
    const jobID = chatroomRef.val().jobID;

    const currentChatroom = await fetchMessages();

    const lastMessages = currentChatroom.messages || [];

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
      await fetch(
        "https://raptor.kent.ac.uk/proj/comp6000/project/08/jobComplete.php",
        {
          method: "post",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            jobID: jobID,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson == -1) {
            console.log("error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {
      console.log(error);
    }
  };

  const removeUser = async () => {
    const database = getDatabase();
    const chatroomRef = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId)
    );
    const jobID = chatroomRef.val().jobID;

    const currentChatroom = await fetchMessages();

    const lastMessages = currentChatroom.messages || [];

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
      await fetch(
        "https://raptor.kent.ac.uk/proj/comp6000/project/08/removeUser.php",
        {
          method: "post",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            jobID: jobID,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson == "error") {
            console.log("error");
          } else {
            Alert("User removed successfully!");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {
      console.log(error);
    }
  };

  const findUserID = (uname) => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/chatViewUser.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: uname,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setUserPostingReview(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
    method: "post",
    header: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      userID: global.userID,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson[1] == firstUser) {
        setHostUser(true);
        findUserID(secondUser);
      } else {
        setHostUser(false);
        findUserID(firstUser);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  if (jobID != null) {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/job.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        jobID: jobID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson[6] == 1) {
          setJobCompleted(true);
        } else if (responseJson[6] == 0) {
          setJobCompleted(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  console.log(jobRejected);
  if (jobRejected == false) {
    if (jobCompleted != null) {
      if (hostUser == true) {
        if (jobCompleted == false) {
          return (
            <>
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
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={showConfirmationPopup}
                    >
                      <Text style={styles.textStyle}>Job Completed?</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={showDeleteConfirmationPopup}
                    >
                      <Text style={styles.textStyle}>Remove User From Job</Text>
                    </Pressable>
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
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={viewUser}>
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={require("./assets/options.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableOpacity>
              </View>
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
          return (
            <>
              <View style={styles.actionBar}>
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={viewUser}>
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
                <View>{review()}</View>
              </View>
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
          return (
            <>
              <View style={styles.actionBar}>
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={viewUser}>
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
              </View>
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
          return (
            <>
              <View style={styles.actionBar}>
                <TouchableOpacity onPress={onBack}>
                  <Image source={require("./assets/back.png")} />
                </TouchableOpacity>
                <TouchableOpacity onPress={viewUser}>
                  <Text style={styles.text}>{selectedUser.username}</Text>
                </TouchableOpacity>
                <View>{review()}</View>
              </View>
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
    return (
      <>
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={onBack}>
            <Image source={require("./assets/back.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={viewUser}>
            <Text style={styles.text}>{selectedUser.username}</Text>
          </TouchableOpacity>
        </View>
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

const styles = StyleSheet.create({
  actionBar: {
    backgroundColor: "#cacaca",
    height: 41,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});
