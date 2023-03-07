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

export default function Users({ users, onClickUser }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
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
        setUsername(responseJson[1]);
      })
      .catch((error) => {
        console.log(error);
      });
  });

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
          if (responseJson == "blank") {
            photo =
              "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/2846608f-203f-49fe-82f6-844a3f485510.png";
          } else {
            photo =
              "https://raptor.kent.ac.uk/proj/comp6000/project/08/" +
              responseJson;
          }
          if (photo != users[i].avatar) {
            const database = getDatabase();
            update(ref(database, "users/" + username + "/friends/" + i), {
              avatar: photo
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [users]);

  const renderUser = ({ item }) => {
    //console.log(users);
    return (
      <Pressable onPress={() => onClickUser(item)} style={styles.row}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <Text>{item.username}</Text>
      </Pressable>
    );
  };

  const getPhoto = (username) => {};

  if (users == null) {
    return (
      <View>
        <Text>No Chats Active</Text>
      </View>
    );
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
