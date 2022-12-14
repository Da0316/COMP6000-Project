import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, ImageBackground, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
//import an images file with pictures in for images 



<<<<<<< Updated upstream
//export default function App() {
const signUp = () =>{ 
=======
      fetch('http://192.168.1.138/signUp.php', {
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
          alert(responseJson);
          navigation.navigate('Login');
        })
        .catch((error)=>{
          console.error(error);
        });
    };

  }
>>>>>>> Stashed changes
  return (
    
    <View style={styles.mainView}>
      <View style={styles.TopView}></View>
      <ScrollView style={styles.bottomView}>
        <Text style={styles.heading}>
          Create Account
        </Text>
        <SafeAreaView style={styles.formView}>
<<<<<<< Updated upstream
          <TextInput placeholder={"Full name*"} placeholderTextColor='#fff' style={styles.TextInput}/>
          <TextInput placeholder={"Email address*"} placeholderTextColor='#fff' style={styles.TextInput}/>
          <TextInput placeholder={"Phone Number*"} placeholderTextColor='#fff' style={styles.TextInput}/>
          <TextInput placeholder={"Password*"} placeholderTextColor='#fff' secureTextEntry={true} style={styles.TextInput}/>
          <TextInput placeholder={"Confirm password*"} placeholderTextColor='#fff' secureTextEntry={true} style={styles.TextInput}/>
          <TouchableOpacity style={styles.buttonsView}>
=======
          <TextInput placeholder={"First name*"} placeholderTextColor='#fff' onChangeText={(firstName) => setFirstName(firstName)} style={styles.TextInput}/>
          <TextInput placeholder={"Last name*"} placeholderTextColor='#fff' onChangeText={(lastName) => setLastName(lastName)} style={styles.TextInput}/>
          <TextInput placeholder={"Set Username*"} placeholderTextColor='#fff' onChangeText={(userName) => setuserName(userName)} style={styles.TextInput}/>
          <TextInput placeholder={"DOB:yyyy-mm-dd*"} placeholderTextColor='#fff' onChangeText={(DOB) => setDOB(DOB)} style={styles.TextInput}/> 
          <TextInput placeholder={"Email address*"} placeholderTextColor='#fff' onChangeText={(email) => setEmail(email)} style={styles.TextInput}/>
          <TextInput placeholder={"Phone Number*"} keyboardType='numeric' placeholderTextColor='#fff' maxLength={11} onChangeText={(pNumber) => setPNumber(pNumber)}  style={styles.TextInput}/>
          <TextInput placeholder={"Postcode*"} placeholderTextColor='#fff' onChangeText={(address) => setAddress(address)} style={styles.TextInput}/>
          <TextInput placeholder={"Password*"} placeholderTextColor='#fff' onChangeText={(password) => setPassword(password)} secureTextEntry={true} style={styles.TextInput}/>
          <TextInput placeholder={"Confirm password*"} placeholderTextColor='#fff' onChangeText={(conPasswrod) => setConPassword(conPasswrod)} secureTextEntry={true} style={styles.TextInput}/>
          <TouchableOpacity style={styles.buttonsView} onPress={()=>handelSubmit()}>
>>>>>>> Stashed changes
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>


    </View>
  );
}
export default signUp; 

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