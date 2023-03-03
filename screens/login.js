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
import { Caption } from "react-native-paper";

// const MyImage = () => {
//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.image}
//         source={{ uri: 'https://raptor.kent.ac.uk/proj/comp6000/project/08/images/O.png' }}
//       />
//     </View>
//   );

const Login = ({navigation}) =>{
  const [userName,setuserName] =useState('');
  const [password,setpassword] =useState('');
  const [image, setImage] = useState('https://raptor.kent.ac.uk/proj/comp6000/project/08/images/O.png');
  const [message, setMessage] =useState('');
  const saveData = async (id) => {
    try {
      await AsyncStorage.setItem("user_id", id);
      
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
      <View style={styles.upper}>
      <Image source={{
                
                uri: image
            }}
            style={styles.image}
        />

      </View>
      <View style={styles.lower}>
        {/* <View style={styles.circle_2} ></View>
        <View style={styles.circle_1}> */}
          <Text style={styles.welcome}>Welcome</Text>
        {/* </View> */}
        <Text style={styles.title}>Welcome</Text>
        <StatusBar style="auto" />
        <Caption style={{marginBottom:8,}}>Login with your username and password</Caption>

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
        <TouchableOpacity style={styles.SignUpBtn} onPress={()=>navigation.navigate('SignUp')}>
          <Text style={styles.LoginText}>Signup</Text>
        </TouchableOpacity>
        </View>
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
    
  },
  upper:{
    flex:2,
    width:"100%",
    height:"100%",
    backgroundColor:"#000000",
    justifyContent:"center"

  }
  ,lower:{
    flex:6,
    width:"100%",
    borderTopRightRadius:80,
    borderTopLeftRadius:80,
    backgroundColor:"#fff",
    alignItems:"center",

  },container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    padding:20,
    fontSize: 25,
    letterSpacing:7,
    marginBottom:10,
    color:"FFFFFF"
  },
  welcome:{
    position:"absolute",
    fontSize: 25,
    color:"#EBEBEB",
    letterSpacing:7
  },
  inputView:{
    backgroundColor: '#EBEBEB',
    borderRadius:30,
    width:"70%",
    height:45,
    marginBottom:10,
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
    color: "#fff",
    fontWeight:"bold",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    width: "40%",
    height: "80%",
    justifyContent: "flex-end",
    alignSelf:"center",

  },
  SignUpBtn:{
    backgroundColor:"#f9ce40",
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  }
});