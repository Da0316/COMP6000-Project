// Users.js - screen with all users to chat with
//imports
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import { getDatabase, get, ref, update, push } from "firebase/database";

//main function that takes in the all user objects, and onClickUser function as parameters
export default function Users({ users, onClickUser }) {
  //setting useState
  const [username, setUsername] = useState(null);

  //useEffect that gets the username of user logged in
  useEffect(() => {
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
        //sets the username
        setUsername(responseJson[1]);
      })
      //catches errors
      .catch((error) => {
        console.log(error);
      });
  });

  // useEffect that gets all the profile pictures of the users, and checks for any changes in pictures
  useEffect(() => {
    for (let i in users) {
      let photo = "";
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/getPhoto.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          uName: users[i].username,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //sets photo depending on response
          if (responseJson == "blank") {
            photo =
              "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/2846608f-203f-49fe-82f6-844a3f485510.png";
          } else {
            photo =
              "https://raptor.kent.ac.uk/proj/comp6000/project/08/" +
              responseJson;
          }
          //makes changes to firebase if photo url's are different
          if (photo != users[i].avatar) {
            const database = getDatabase();
            update(ref(database, "users/" + username + "/friends/" + i), {
              avatar: photo
            });
          }
        })
        //catches errors
        .catch((error) => {
          console.log(error);
        });
    }
    //refreshes when new users are added
  }, [users]);

  //function that renders a user component, takes the user item as a parameter
  const renderUser = ({ item }) => {
    //console.log(users);
    return (
      // user that onclick redirects to the caht
      <Pressable onPress={() => onClickUser(item)} style={styles.row}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <Text>{item.username}</Text>
      </Pressable>
    );
  };

  //if logged in user has no chats
  if (users == null) {
    return (
      <View>
        <Text>No Chats Active</Text>
      </View>
    );
  //otherwise loads all the users in a flatlsit
  } else {
    return (
      <>
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.username.toString()}
        />
      </>
    );
  }
}

//css styling
const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomColor: "#cacaca",
    borderBottomWidth: 1,
  },
  addUser: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    backgroundColor: "#cacaca",
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
});
