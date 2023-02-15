import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {Image, TouchableOpacity, StyleSheet, Text, View, Alert} from 'react-native';
import {getDatabase, get, ref, onValue, off, update, remove, child} from 'firebase/database';

export default function Chat({onBack, myData, selectedUser, viewUser}) {
  const [messages, setMessages] = useState([]);

  
  useEffect(() => {
    const database = getDatabase();
    const chatroomRef = ref(database, `chatrooms/${selectedUser.chatroomId}`);
    //load old messages
    const loadData = async () => {
      const myChatroom = await fetchMessages();
      setMessages(renderMessages(myChatroom.messages));
    };

    loadData();

    // set chatroom change listener
    onValue(chatroomRef, snapshot => {
      const data = snapshot.val();
      setMessages(renderMessages(data.messages));
    });

    return () => {
      //remove chatroom listener
      off(chatroomRef);
    };
  }, [fetchMessages, renderMessages, selectedUser.chatroomId]);

  const renderMessages = useCallback(
    msgs => {
      //structure for chat library:
      // msg = {
      //   _id: '',
      //   user: {
      //     avatar:'',
      //     name: '',
      //     _id: ''
      //   }
      // }

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
    [
      myData.avatar,
      myData.username,
      selectedUser.avatar,
      selectedUser.username,
    ],
  );

  const fetchMessages = useCallback(async () => {
    const database = getDatabase();

    const snapshot = await get(
      ref(database, `chatrooms/` + selectedUser.chatroomId),
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

      setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
    },
    [fetchMessages, myData.username, selectedUser.chatroomId],
  );

  const showConfirmationPopup = () => {
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

  const handleJobCompleted = async () => {

      const database = getDatabase();
      const chatroomRef = await get(ref(database, `chatrooms/` + selectedUser.chatroomId));
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
        await fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/jobComplete.php', {
          method: 'post',
          header: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            jobID: jobID,
          }),
        })    
        .then((response) => response.json())
        .then((responseJson) => {
        })
        .catch((error) => {
              console.log(error);
        });
    } catch {
      console.log(error);
    }
  }

  return (
    <>
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={onBack}>
          <Image source={require('./assets/back.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={viewUser}>
            <Text style={styles.text}>{selectedUser.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showConfirmationPopup}>
            <Text style={styles.text}>Completed?</Text>
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={newMessage => onSend(newMessage)}
        user={{
          _id: myData.username,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    backgroundColor: '#cacaca',
    height: 41,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: 'bold',
  }
});