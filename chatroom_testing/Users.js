import React from "react";
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

export default function Users({ users, onClickUser }) {
  const renderUser = ({ item }) => {
    return (
      <Pressable onPress={() => onClickUser(item)} style={styles.row}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <Text>{item.username}</Text>
      </Pressable>
    );
  };

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
