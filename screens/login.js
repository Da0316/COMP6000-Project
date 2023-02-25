import { StatusBar } from "expo-status-bar";
//import { response } from "express";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({navigation}) =>{
  const [userName,setuserName] =useState('');
  const [password,setpassword] =useState('');

  const [message, setMessage] =useState('');
  const saveData = async (id) => {
    try {
      await AsyncStorage.setItem("user_id", id);
      console.log("id", id);
    } catch (e) {
      alert("Failed to save the data to the storage");
    }
  };

  const onForgetPassword = () => {
      // Navigate to the ForgotPassword screen/modal
     navigation.navigate('ForgotPassword');

  }
    signIn = () => {
      
      if (userName == '') {
        alert("Please enter username");
        
      } else if (password == '') {
        alert("Please enter a password");
      } else {
        //when on campus 
        //fetch('http://129.12.212.41/login.php', {
        //https://raptor.kent.ac.uk/proj/comp6000/project/08/login.php
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/login.php', { //needs to be changed to your own ip
          method: 'post',
          header: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            // we will pass our input data to server
            username: userName,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == -1) {
              alert('Wrong Login Details');
            } else {
              // redirect to profile page
              saveData(responseJson);
              alert('Successfully Login');
              if (responseJson != null){
                global.userID = responseJson;
              }
              navigation.navigate('HomeScreen');
            }
          })
          .catch((error) => {
            //console.error(error);
            alert("incorrect details");
          });
      }}
  
    
  return (
    <View style={styles.container}>
      <View style={styles.circle_2} ></View>
      <View style={styles.circle_1}>
        <Text style={styles.welcome}>Welcome</Text>
      </View>
      <Text style={styles.title}>Login</Text>
      <StatusBar style="auto" />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          placeholderTextColor={'#3c3744'}
          onChangeText={(userName) => setuserName(userName)}
        />
      </View>


      <View style={styles.inputView}>
      <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor={'#3c3744'}
          onChangeText={(password) => setpassword(password)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.LoginBtn} onPress={()=>signIn()}>
        <Text style={styles.LoginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForgetPassword}>
        <Text style={styles.forgotPassBtn}>Forgot Password?</Text>
      </TouchableOpacity>



    <Text>Don't have an account?</Text>
      <TouchableOpacity style={styles.LoginBtn} onPress={()=>navigation.navigate('SignUp')}>
        <Text style={styles.LoginText}>signUp</Text>
      </TouchableOpacity>
    </View>
  );
}
export default Login;

const styles = StyleSheet.create({
  circle_1:{
    position:"absolute",
    width :400,
    height:400,
    borderRadius:1000,
    backgroundColor:"#F9CE40",
    transform:[
      {translateX:0},
      {translateY:-350},
      {rotate: "0deg"},
    ],
    elevation:20
  },
  circle_2:{
    position:"absolute",
    width :400,
    height:400,
    borderRadius:1000,
    backgroundColor:"#B28B1D",
    transform:[
      {translateX:0},
      {translateY:-348},
      {rotate: "0deg"},
    ],
    

    //ios
    // shadowColor:"#000000",
    // shadowOffset:{
    //   width:0,
    //   height:4
    // },
    // shadowOpacity:0.25,
    // shadowRadius:4
    
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    padding:30,
    fontSize: 25,
    //fontFamily:"Cochin",
    marginBottom:50,
    color:"FFFFFF"
  },
  welcome:{
    position:"absolute",
    fontSize: 25,
    color:"#EBEBEB",
  },
  inputView:{
    backgroundColor: '#EBEBEB',
    borderRadius:30,
    width:"70%",
    height:45,
    marginBottom:20,
    alignItems:"center"
  },
  TextInput:{
    height:50,
    flex:1,
    padding:10,
    //marginRight:10,
    alignItems:'center'
  },
  forgotPassBtn:{
    height:30,
    marginTop:5,
    marginBottom:10,
    //borderRadius: 25,
  },
  LoginBtn:{
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    backgroundColor: "#1A1918",
  },
  LoginText:{
    color: "#C2C3C4",
  }
});