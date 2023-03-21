//login.js - the page for the login screen of the app
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Caption } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

//@param "navigation" - passes the naviagtion stack to the login page
const Login = ({ navigation }) => {
  //variables to store the details that the user enters when trying to login to the app
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");
  const isFocused=useIsFocused(); // React Navigation hook to check if screen is focused
  //variable to store the logo for the app
  const [image, setImage] = useState(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/images/O.png"
  );
  useEffect(()=>{setuserName(""),setpassword("")},[isFocused])
  const [message, setMessage] = useState("");

   // Function to save the user's ID to the async storage
  const saveData = async (id) => {
    try {
      await AsyncStorage.setItem("user_id", id);
    } catch (e) {
        ("Failed to save the data to the storage");
    }
  };

  // Navigate to the ForgotPassword screen/modal
  const onForgetPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  //when the "signIn" button is pressed, this function will make a call to the backend of the app and check if a user with these details exists
  signIn = () => {
    //checks if the input boxes have any data in
    if (userName == "") {
      alert("Please enter username");
    } else if (password == "") {
      alert("Please enter a password");
    } else { //else - if the input boxes have data in, the backend call is made
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/login.php", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ //passes the inputted username and password to the backend
          username: userName,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //depending on the response from the backend, the app will either display an incorrect details alert or log the user in
          if (responseJson == -1) {
            alert("Wrong Login Details");
          } else {
            saveData(responseJson);
            alert("Successfully Login");
            if (responseJson != null) {
              global.userID = responseJson;
            }
            //once the user has entered correct details, navigation takes place to get to the home screen of the app.
            navigation.navigate("HomeScreen");
          }
        })
        .catch((error) => {
          alert("incorrect details");
        });
    }
  };

  // Rendering the UI for the Login component
  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.lower}>
        {/* Welcome message */}
        <Text style={styles.title}>Welcome</Text>
        <Caption style={{ marginBottom: 8 }}>
          Login with your username and password
        </Caption>

        <View style={styles.inputView}>
          {/* input for username */}
          <TextInput
            style={styles.TextInput}
            value={userName}
            placeholder="Username"
            placeholderTextColor={"#3c3744"}
            onChangeText={(userName) => setuserName(userName)}
            testID="usernameTest"
          />
        </View>

        <View style={styles.inputView}>
          {/* input for password */}
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            value={password}
            placeholderTextColor={"#3c3744"}
            onChangeText={(password) => setpassword(password)}
            testID="passwordTest"
            secureTextEntry
          />
        </View>
        {/* login button */}
        <TouchableOpacity testID="loginButton" style={styles.LoginBtn} onPress={() => signIn()}>
          <Text style={styles.LoginText}>Login</Text>
        </TouchableOpacity>

        {/* forgot password button */}
        <TouchableOpacity onPress={onForgetPassword}>
          <Text style={styles.forgotPassBtn}>Forgot Password?<Caption style={{fontSize:12}}> Press here</Caption></Text>
        </TouchableOpacity>

        <Text>Don't have an account?</Text>
        {/* signup button */}
        <TouchableOpacity
          style={styles.SignUpBtn}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.LoginText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

// css styling
const styles = StyleSheet.create({
  upper: {
    flex: 2,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
  },
  lower: {
    flex: 5,
    alignContent:"center",
    width: "100%",
    borderTopRightRadius: 80,
    borderTopLeftRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    //alignSelf:"stretch",
    flexGrow: 4, 
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    padding: 10,
    fontSize: 25,
    letterSpacing: 7,
    color: "#c2c3c4",
  },
  inputView: {
    backgroundColor: "#EBEBEB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 10,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  forgotPassBtn: {
    height: 30,
    marginTop: 5,
    marginBottom: 10,
  },
  LoginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    backgroundColor: "#1A1918",
  },
  LoginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    width: "40%",
    height: "80%",
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  SignUpBtn: {
    backgroundColor: "#f9ce40",
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
});
