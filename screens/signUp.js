import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet, Text, ScrollView, ImageBackground, View, SafeAreaView, TextInput, TouchableOpacity, Button } from 'react-native';
import {getDatabase, get, ref, set, onValue, update, push} from 'firebase/database'

//package for calander picker 
//import an images file with pictures in for images 
0
import DateTimePickerModal from "react-native-modal-datetime-picker";
//date field to be changed 
//export default function App() {
const SignUp = ({navigation}) =>{ 
    const [userName,setuserName] =useState('');
    const [firstName,setFirstName] =useState('');
    const [lastName,setLastName] =useState('');
    const [DOB,setDOB] =useState('');
    const [date, setDate]=useState(new Date);
    const [show, setShow] = useState(false);
    const [email,setEmail] =useState('');
    const [pNumber,setPNumber] =useState('');
    const [address,setAddress] =useState(''); //need to discuss with group what address we are taking
    const [password,setPassword] =useState('');
    const [conPasswrod,setConPassword] =useState('');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    handelSubmit = () =>{
    //onChangeText={(userName) => setuserName(userName)}
    
    if(password != conPasswrod){
      alert("Passwords must match!");
    } else{

      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/signUp.php', {
        method: 'post',
        header:{
          Accept: 'application/json',
          'Content-type': 'application/json',
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
        .then((responseJson) =>{
          if (responseJson === "try again"){
            alert("Please fill in details ")
          } else if (responseJson === "email already exists"){
            alert("Account already signed up with this email")
          } else if (responseJson === "username already exists"){
            alert("Username already exists");
          } else {
            alert("Signup Successful!");
            const newUserObj = {
              username: String(responseJson[1]), 
              avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fnobita.me%2Fresources%2Favatar-from-url.86%2F&psig=AOvVaw1HkgvX6GHC1E4KWum1aYA8&ust=1667929212435000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDj19POnPsCFQAAAAAdAAAAABAO',
            };
            const database = getDatabase();
            set(ref(database, 'users/' + responseJson[1]), newUserObj);
            navigation.navigate('SelectSpecialities', {userID: responseJson[0]});
          }
        })
        .catch((error)=>{
          console.error(error);
        });
    };

  }
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    let tempDate = date;
    let fDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    //date = fDate;
    setDOB(fDate);
    hideDatePicker();
  };

  const renderCustomHeader = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'lightblue' }}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={{ fontSize: 18 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20 }}>Select a Date</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(false)}>
          <Text style={{ fontSize: 18 }}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (

    
      <View style={styles.mainView}>
        <ScrollView style={styles.bottomView}>
          <Text style={styles.heading}>
            Create Account
          </Text>
          <SafeAreaView style={styles.formView}>
            <TextInput placeholder={"First name*"}  onChangeText={(firstName) => setFirstName(firstName)} style={styles.TextInput}/>
            <TextInput placeholder={"Last name*"}  onChangeText={(lastName) => setLastName(lastName)} style={styles.TextInput}/>
            <TextInput placeholder={"Set Username*"}  onChangeText={(userName) => setuserName(userName)} style={styles.TextInput}/>
            
            <View>
              <Button title="Date of Birth" onPress={showDatePicker} style={{color:"green" , padding:10}} />
              <DateTimePickerModal
                  // customStyles={{
                  //   datePicker: { backgroundColor: "green" },
                  //   datePickerCon: { backgroundColor: "green" },
                  //   dateInput: { borderWidth: 0 },
                  //   dateText: { color: "green" },
                  //   btnTextConfirm: { color: "green" },
                  //   btnTextCancel: { color: "green" }
                  // }}
                isVisible={isDatePickerVisible}
                //mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}


               // pickerContainerStyleIOS={{ backgroundColor: 'green', padding: 16 }}
                datePickerModeAndroid="default"

                //customHeaderIOS={renderCustomHeader}
                //style={{ borderRadius: 8 }}
                // headerTextIOS="Pick a Date"
                // cancelTextIOS="Cancel"
                // confirmTextIOS="Confirm"
                // datePickerModeAndroid="spinner"
                //  style={{ borderRadius: 8 }}
                //  customCancelButtonIOS={{ color: "red", fontSize: 20 }}
                //  customConfirmButtonIOS={{ color: "green", fontSize: 20 }}
                //  customTitleContainerIOS={{ backgroundColor: "pink" }}
                // customTitleIOS="Select a Date"
                // locale="en_GB"
                
              />
            </View>
            <TextInput placeholder={"Email address*"}  onChangeText={(email) => setEmail(email)} style={styles.TextInput}/>
            <TextInput placeholder={"Phone Number*"} keyboardType='numeric'  maxLength={11} onChangeText={(pNumber) => setPNumber(pNumber)}  style={styles.TextInput}/>
            <TextInput placeholder={"address*"}  onChangeText={(address) => setAddress(address)} style={styles.TextInput}/>
            <TextInput placeholder={"Password*"}  onChangeText={(password) => setPassword(password)} secureTextEntry={true} style={styles.TextInput}/>
            <TextInput placeholder={"Confirm password*"}  onChangeText={(conPasswrod) => setConPassword(conPasswrod)} secureTextEntry={true} style={styles.TextInput}/>
            <TouchableOpacity style={styles.buttonsView} onPress={()=>handelSubmit()}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>


      </View>
  );
}
export default SignUp; 

//container for styles 
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  mainView:{
    //marginTop:10,
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#FFFFFF"

  },
  TopView:{
    width:'100%',
    height:'0%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'

  },
  bottomView:{
    width:'100%',
    height:'80%',
    backgroundColor:'#f9ce40',
    borderTopLeftRadius:40,
    borderTopRightRadius:40
  },
  heading:{
    color:'#1a1918',
    fontSize:30,
    fontWeight:'bold',
    textAlign:"center",
    //marginLeft:20,
    marginTop:20

  },
  formView:{
    wifth:'100%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:10,
    
  },
  TextInput:{
    width:'90%',
    borderWidth:1,
    borderColor:'#1a1918',
    height:50,
    borderRadius:10,
    paddingLeft:5,
    marginTop:20,
    color:'#fff'
  },
  

  buttonsView:{
    width:'90%',
    color:'#000',
    height:50,
    backgroundColor:'#fff',
    borderRadius:10,
    marginVertical:10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  buttonText:{
    fontWeight:'bold',
    fontSize:18
  },
  datePickerModal:{
    backgroundColor:"black",
    color:"white"
  }
});