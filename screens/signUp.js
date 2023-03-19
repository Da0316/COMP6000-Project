//signUp.js - page for the sign up screen so users can create accounts
//@author - ajs215

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
//imports for a community date picker
import DatePicker from "react-native-modern-datepicker";
import { isValid } from "date-fns";

//main function for sign up, has navigation stack to redirect to specialities screen once sign up is complete
const SignUp = ({ navigation }) => {
  //variables for all the data we take on sign up
  const [userName, setuserName] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [DOB, setDOB] = useState(null);
  const [email, setEmail] = useState(null);
  const [pNumber, setPNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [conPasswrod, setConPassword] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [address, setAddress] = useState(null);
  const [address1, setAddress1] = useState(null);
  const [address2, setAddress2] = useState(null);
  const [addressCity, setAddressCity] = useState(null);
  const [addressPostCode, setAddressPostCode] = useState(null);
  const [apiKey, setApiKey] = useState(null); //variable for the api key to check if the address inputted exists

  //fetches the api key form the backend, so it is stored securely 
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
      //sets the api key
      setApiKey(responseJson);
    })
    .catch((error) => {
      alert("incorrect details");
    });
  
  //function checkAddress
  //@param address - an object containg each of the fields we take for address
  const checkAddress = async (address) => {
    //formatted address, computes the inputted address into a format that the google geocoding api can recognise
    const formattedAddress = `${address.name}, ${address.road}, ${address.city} ${address.postcode}, ${address.country}`;
    //url is is the url for the api call
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      formattedAddress
    )}&key=${apiKey}`;
    
    //makes the call to the apir
    try {
      const response = await fetch(url);
      //sets the returned address to the variable data
      const data = await response.json();
      //if data.results is not null then the address exists
      if (data.results.length > 0) {
        //sets the address to the correct address retrived fro mapi
        setAddress(data.results[0].formatted_address);
        return true;
        
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  //not currently needed
  const formatAddress = () => {
    if (address2 != null) {
      setAddress(
        address1 + ", " + address2 + ", " + addressCity + ", " + addressPostCode
      );
    } else {
      setAddress(address1 + ", " + addressCity + ", " + addressPostCode);
    }
  };

  const calculateAge = (birthday) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  //function - handelSubmit handels the button press of the signup
  handelSubmit = () => {
    if (!DOB || !isValid(new Date(DOB))) {
      alert("Please enter a valid date of birth");
      return false;
    }

    const age = calculateAge(DOB);
    if (age < 18) {
      alert("You must be at least 18 years old to sign up");
      return false;
    }

    //regular expression of all the characters allowed in password
    const strongRegex = new RegExp(
      "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    );
    //checks if the email is a vlaid email (contains an @ sign)
    if (!strongRegex.test(email)) {
      alert("email is not valid");
      return false;
    } else if (password.length < 8) { //checks if the password is above the required length
      alert(
        "password is not of valid form, must containt at least 1 upper 1 lowercase 1 special and 8 characters long"
      );
      return false;
      //checks if the address fields have been filled in
    } else if (address1 == null) {
      alert("please enter address line 1");
      return false;
    } else if (addressCity == null) {
      alert("please enter the address city");
      return false;
    } else if (addressPostCode == null) {
      alert("please enter the address post code");
      return false;
      //checks password and the confirm password fields match
    } else if (password != conPasswrod) {
      alert("Passwords must match!");
      return false;
    }
    //creates the object of the address to if the address exists
    const addressToVerify = {
      name: address1,
      road: address2,
      city: addressCity,
      postcode: addressPostCode,
      country: "UK",
    };
    //calls the checkAddress function
    if (checkAddress(addressToVerify)) {
      console.log("ok");
      
    } else {
      alert("address does not exist");
      return false;
    }
    
    //checks if the fields have been filled out
    if (userName == null || firstName == null || lastName == null || DOB == null || address == null 
      ||email == null || pNumber == null || password == null){
        alert("Please fill out all the fields");
        return false;
      }
      //if the fields have been filled out correctly a call to save the users inputs in the database is made
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
        .then((responseJson) => { //response from php is given - if the username or email is already in the database, it will not allow you to sign up with those details
          if (responseJson === "try again") {
            alert("Please fill in details ");
          } else if (responseJson === "email already exists") {
            alert("Account already signed up with this email");
          } else if (responseJson === "username already exists") {
            alert("Username already exists");
          }
          // else if (responseJson === "You must be at least 18 years old to sign up"){
          //   alert("You must be at least 18 years old to sign up");
          // } 
          else { //if everything is valid the sign up is accepted
            alert("Signup Successful!");
            const newUserObj = {
              username: String(responseJson[1]),
              avatar:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fnobita.me%2Fresources%2Favatar-from-url.86%2F&psig=AOvVaw1HkgvX6GHC1E4KWum1aYA8&ust=1667929212435000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDj19POnPsCFQAAAAAdAAAAABAO",
            };
            const database = getDatabase();
            //navigates to the specialities after sign up
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

  //code to hide and show the date picker
  const showDatepicker = () => {
    setShowCompleted(!showCompleted);
  };

  //code to handel the date picker input and save the response from the date picker in a form recognised by our database
  const handleConfirm = (date) => {
    let tempDate = date;
    let date1 = tempDate.replace("/", "-");
    let date2 = date1.replace("/", "-");
    console.log(date2);
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
            <Text style={styles.LoginText}>
              Date of birth:{DOB}
            </Text>
          </TouchableOpacity>

          {showCompleted && (
            <DatePicker
              testID="datePicker"
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
            testID="signUpButton"
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
