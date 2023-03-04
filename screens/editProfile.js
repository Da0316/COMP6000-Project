import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(
    "2846608f-203f-49fe-82f6-844a3f485510.png"
  );
  const [selectedImageType, setSelectedImageType] = useState("");
  const [selected, setSelected] = useState(false);

  const isFocused = useIsFocused();

  const [image, setImage] = useState(null);
  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem("user_id");

      if (value !== null) {
        setUserID(value);
      }
    } catch (e) {
      alert("Failed to fetch the input from storage");
    }
  };
  useEffect(() => {
    readData();
  }, [isFocused]);
  useEffect(() => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUsername(responseJson[1]);
        setFirstname(responseJson[2]);
        setLastname(responseJson[3]);
        setAddress(responseJson[5]);
        setEmail(responseJson[6]);
        setPhone_number(responseJson[7]);
        if (responseJson[8] == null) {
        } else {
          setSelectedImageName(responseJson[8]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userID]);

  const handelSubmit = async () => {
    const params = new FormData();
    params.append("username", username);
    params.append("firstname", firstname);
    params.append("lastname", lastname);
    params.append("email", email);
    params.append("address", address);
    params.append("phone_number", phone_number);
    params.append("userID", userID);
    image &&
      params.append("user_image", {
        uri: image,
        type: "image/jpeg",
        name: Math.floor(Math.random() * 100) + 1 + "photo.jpg",
      });
    console.log("params", params);
    const res = await axios.post(
      `https://raptor.kent.ac.uk/proj/comp6000/project/08/edit.php`,
      params
    );
    if (res.data === "success") {
      alert("profile updated successfully");
    } else {
      alert("something went wrong");
    }
    console.log("res", res.data);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    setImage(result.uri);
    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      setSelectedImage(localUri);
      setSelectedImageName(filename);
      setSelectedImageType(type);
      setSelected(true);
      const formData = new FormData();
      formData.append("name", {
        name: filename,
        type: type,
        uri: localUri,
      });
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => pickImageAsync()}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={{
                  uri: image
                    ? image
                    : "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/" +
                      selectedImageName,
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 100 / 2 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="camera"
                    size={35}
                    color="#f9ce40"
                    style={{
                      opacity: 0.7,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#fff",
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {firstname} {lastname}
          </Text>
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#ead184" />
          <TextInput
            placeholder={firstname}
            placeholderTextColor="#ead184"
            autoCorrect={false}
            style={styles.textInput}
            value={firstname}
            onChangeText={setFirstname}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#ead184" />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#ead184"
            autoCorrect={false}
            style={styles.textInput}
            value={lastname}
            onChangeText={setLastname}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} color="#ead184" />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#ead184"
            autoCorrect={false}
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="phone" size={20} color="#ead184" />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#ead184"
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.textInput}
            value={phone_number}
            onChangeText={setPhone_number}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" size={20} color="#ead184" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ead184"
            keyboardType="email-address"
            autoCorrect={false}
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.action}>
          <Icon name="map-marker-outline" size={20} color="#1a1918" />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#ead184"
            autoCorrect={false}
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => handelSubmit()}
        >
          <Text style={styles.panelButtonTitle}>UPDATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1a1918",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "android" ? -2 : -12,
    paddingLeft: 10,
    color: "#1a1918",
  },
});
