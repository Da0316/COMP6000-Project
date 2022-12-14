import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { StyleSheet, Text, ScrollView, ImageBackground, View, SafeAreaView, TextInput, TouchableOpacity, Button } from 'react-native';

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
        .then((response) => response.text())
        .then((responseJson) =>{
          console.log(responseJson)
          if (responseJson === "try again"){
            alert("Please fill in details ")
          } else if (responseJson === "email already exists"){
            alert("Account already signed up with this email")
          } else {
            alert("Signup Successful!");
            navigation.navigate('SelectSpecialities', {responseJson});
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
  
  return (
    
    <View style={styles.mainView}>
      <View style={styles.TopView}></View>
      <ScrollView style={styles.bottomView}>
        <Text style={styles.heading}>
          Create Account
        </Text>
        <SafeAreaView style={styles.formView}>
          <TextInput placeholder={"First name*"} placeholderTextColor='#fff' onChangeText={(firstName) => setFirstName(firstName)} style={styles.TextInput}/>
          <TextInput placeholder={"Last name*"} placeholderTextColor='#fff' onChangeText={(lastName) => setLastName(lastName)} style={styles.TextInput}/>
          <TextInput placeholder={"Set Username*"} placeholderTextColor='#fff' onChangeText={(userName) => setuserName(userName)} style={styles.TextInput}/>
          
          <View>
            <Button title="Show Date Picker" onPress={showDatePicker} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <TextInput placeholder={"Email address*"} placeholderTextColor='#fff' onChangeText={(email) => setEmail(email)} style={styles.TextInput}/>
          <TextInput placeholder={"Phone Number*"} keyboardType='numeric' placeholderTextColor='#fff' maxLength={11} onChangeText={(pNumber) => setPNumber(pNumber)}  style={styles.TextInput}/>
          <TextInput placeholder={"address*"} placeholderTextColor='#fff' onChangeText={(address) => setAddress(address)} style={styles.TextInput}/>
          <TextInput placeholder={"Password*"} placeholderTextColor='#fff' onChangeText={(password) => setPassword(password)} secureTextEntry={true} style={styles.TextInput}/>
          <TextInput placeholder={"Confirm password*"} placeholderTextColor='#fff' onChangeText={(conPasswrod) => setConPassword(conPasswrod)} secureTextEntry={true} style={styles.TextInput}/>
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
    marginTop:40,
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'

  },
  TopView:{
    width:'100%',
    height:'20%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'

  },
  bottomView:{
    width:'100%',
    height:'80%',
    backgroundColor:'purple',
    borderTopLeftRadius:40,
    borderTopRightRadius:40
  },
  heading:{
    color:'#fff',
    fontSize:30,
    fontWeight:'bold',
    marginLeft:20,
    marginTop:50

  },
  formView:{
    wifth:'100%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:40
  },
  TextInput:{
    width:'90%',
    borderWidth:1,
    borderColor:'#fff',
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
    marginTop:20,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  buttonText:{
    fontWeight:'bold',
    fontSize:18
  }
});