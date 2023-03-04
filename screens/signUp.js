import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import DatePicker from "react-native-modern-datepicker";

const SignUp = ({ navigation }) => {
  const [userName, setuserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [password, setPassword] = useState("");
  const [conPasswrod, setConPassword] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [address, setAddress] = useState("");
  const [address1, setAddress1] = useState(null);
  const [address2, setAddress2] = useState(null);
  const [addressCity, setAddressCity] = useState(null);
  const [addressPostCode, setAddressPostCode] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/api.php", {
    method: "post",
    header: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      setApiKey(responseJson);
    })
    .catch((error) => {
      alert("incorrect details");
    });

  const checkAddress = async (address) => {
    const formattedAddress = `${address.name}, ${address.road}, ${address.city} ${address.postcode}, ${address.country}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      formattedAddress
    )}&key=${apiKey}`;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.results.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const formatAddress = () => {
    if (address2 != null) {
      setAddress(
        address1 + ", " + address2 + ", " + addressCity + ", " + addressPostCode
      );
    } else {
      setAddress(address1 + ", " + addressCity + ", " + addressPostCode);
    }
  };

  handelSubmit = () => {
    const strongRegex = new RegExp(
      "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    );

    if (!strongRegex.test(email)) {
      alert("email is not valid");
      return false;
    } else if (password.length < 8) {
      alert(
        "password is not of valid form, must containt at least 1 upper 1 lowercase 1 special and 8 characters long"
      );
      return false;
    } else if (DOB == "") {
      alert("please select DOB");
    } else if (address1 == null) {
      alert("please enter address line 1");
    } else if (addressCity == null) {
      alert("please enter the address city");
    } else if (addressPostCode == null) {
      alert("please enter the address post code");
    }

    const addressToVerify = {
      name: address1,
      road: address2,
      city: addressCity,
      postcode: addressPostCode,
      country: "UK",
    };

    if (password != conPasswrod) {
      alert("Passwords must match!");
    }

    if (checkAddress(addressToVerify)) {
      console.log("ok");
    } else {
      alert("address does not exist");
    }
    formatAddress();

    if (address != "") {
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/signUp.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          fname: firstName,
          lname: lastName,
          dob: DOB,
          address: address,
          email: email,
          phone: pNumber,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson === "try again") {
            alert("Please fill in details ");
          } else if (responseJson === "email already exists") {
            alert("Account already signed up with this email");
          } else if (responseJson === "username already exists") {
            alert("Username already exists");
          } else {
            alert("Signup Successful!");
            const newUserObj = {
              username: String(responseJson[1]),
              avatar:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fnobita.me%2Fresources%2Favatar-from-url.86%2F&psig=AOvVaw1HkgvX6GHC1E4KWum1aYA8&ust=1667929212435000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDj19POnPsCFQAAAAAdAAAAABAO",
            };
            const database = getDatabase();
            set(ref(database, "users/" + responseJson[1]), newUserObj);
            navigation.navigate("SelectSpecialities", {
              userID: responseJson[0],
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const showDatepicker = () => {
    setShowCompleted(!showCompleted);
  };

  const handleConfirm = (date) => {
    let tempDate = date;
    let date1 = tempDate.replace("/", "-");
    let date2 = date1.replace("/", "-");
    setDOB(date2);
    showDatepicker();
  };

  const renderCustomHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backgroundColor: "lightblue",
        }}
      >
        <TouchableOpacity onPress={handleCancel}>
          <Text style={{ fontSize: 18 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20 }}>Select a Date</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(false)}>
          <Text style={{ fontSize: 18 }}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainView}>
      <ScrollView style={styles.bottomView} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create Account</Text>
        <SafeAreaView style={styles.formView}>
          <TextInput
            placeholder={"First name*"}
            onChangeText={(firstName) => setFirstName(firstName)}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"Last name*"}
            onChangeText={(lastName) => setLastName(lastName)}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"Set Username*"}
            onChangeText={(userName) => setuserName(userName)}
            style={styles.TextInput}
          />

          <TouchableOpacity style={styles.LoginBtn} onPress={showDatepicker}>
            <Text style={styles.LoginText}>Date of birth:{DOB}</Text>
          </TouchableOpacity>

          {showCompleted && (
            <DatePicker
              options={{
                backgroundColor: "#090C08",
                textHeaderColor: "#FFA25B",
                textDefaultColor: "#F6E7C1",
                selectedTextColor: "#fff",
                mainColor: "#F4722B",
                textSecondaryColor: "#D6C7A1",
                borderColor: "rgba(122, 146, 165, 0.1)",
              }}
              onDateChange={handleConfirm}
              current="1990-07-23"
              selected="1990-07-23"
              mode="datepicker"
              minuteInterval={30}
              style={{ borderRadius: 10 }}
              containerStyle={{ width: "100%" }}
            />
          )}

          <TextInput
            placeholder={"Email address*"}
            onChangeText={(email) => setEmail(email)}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"Phone Number*"}
            keyboardType="numeric"
            maxLength={11}
            onChangeText={(pNumber) => setPNumber(pNumber)}
            style={styles.TextInput}
          />
          <Text style={{ marginTop: 10, marginBottom: -5, fontWeight: "bold" }}>
            Enter your full address:
          </Text>

          <TextInput
            placeholder={"address Line 1*"}
            onChangeText={(address1) => setAddress1(address1)}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"address Line 2"}
            onChangeText={(address2) => setAddress2(address2)}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"City*"}
            onChangeText={(addressCity) => setAddressCity(addressCity)}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"Post Code*"}
            onChangeText={(addressPostCode) =>
              setAddressPostCode(addressPostCode)
            }
            style={styles.TextInput}
          />
          <Text style={{ fontWeight: "bold" }}>
            Password must containt at least:
          </Text>
          <Text>* 1 UpperCase Character</Text>
          <Text>* 1 LowerCase Character</Text>
          <Text>* 1 Special Character</Text>
          <Text>* at least 8 characters long</Text>
          <TextInput
            placeholder={"Password*"}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
            style={styles.TextInput}
          />
          <TextInput
            placeholder={"Confirm password*"}
            onChangeText={(conPasswrod) => setConPassword(conPasswrod)}
            secureTextEntry={true}
            style={styles.TextInput}
          />
          <TouchableOpacity
            style={styles.buttonsView}
            onPress={() => handelSubmit()}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};
export default SignUp;

//container for styles
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  TopView: {
    width: "100%",
    height: "0%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    width: "100%",
    height: "80%",
    backgroundColor: "#f9ce40",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  heading: {
    color: "#1a1918",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  formView: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  TextInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#1a1918",
    height: 50,
    borderRadius: 10,
    paddingLeft: 5,
    marginTop: 20,
    color: "#fff",
  },

  buttonsView: {
    width: "90%",
    color: "#000",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  datePickerModal: {
    backgroundColor: "black",
    color: "white",
  },
  LoginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: -5,
    backgroundColor: "#1A1918",
  },
  LoginText: {
    color: "#C2C3C4",
  },
});
