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
            //console.log(responseJson);
            if (responseJson == -1) {
              alert('Wrong Login Details');
            } else {
              // redirect to profile page
              alert('Successfully Login');
              if (responseJson != null){
                global.userID = responseJson;
              }
              navigation.navigate('HomeScreen');
            }
          })
          .catch((error) => {
            alert("incorrect details");
            //console.error(error);
          });
      }}
  
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
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

      <TouchableOpacity >
        <Text style={styles.forgotPassBtn}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.LoginBtn} onPress={()=>signIn()}>
        <Text style={styles.LoginText}>Login</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#EEF5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    padding:20,
    fontSize: 25,
    //fontFamily:"Cochin",
    marginBottom:50
  },
  inputView:{
    backgroundColor: '#B8D8D8',
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
    marginBottom:10
  },
  LoginBtn:{
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#FE5F55",
  }
});