import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, ImageBackground, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
//import an images file with pictures in for images 



//export default function App() {
const signUp = () =>{ 
  return (
    // <SafeAreaView style={{paddingHorizontal:20, flex: 1, backgroundColor:'#ffffff'}}>
    //   <ScrollView 
    //     style={{flex: 1, backgroundColor: 'orange'}}
    //     showsVerticalScrollIndicator={false}
        
          


    //     >
          
    //     <View style={styles.buttonsView}>
          
    //       {/* <View style={{padding:150}}>
    //         <Text> welcome</Text>
    //       </View> */}
    //     </View>

          
    //   </ScrollView>
    // </SafeAreaView>
    //end
    <View style={styles.mainView}>
      <View style={styles.TopView}></View>
      <ScrollView style={styles.bottomView}>
        <Text style={styles.heading}>
          Create Account
        </Text>
        <SafeAreaView style={styles.formView}>
          <TextInput placeholder={"Full name*"} placeholderTextColor='#fff' style={styles.TextInput}/>
          <TextInput placeholder={"Email address*"} placeholderTextColor='#fff' style={styles.TextInput}/>
          <TextInput placeholder={"Phone Number*"} placeholderTextColor='#fff' style={styles.TextInput}/>
          <TextInput placeholder={"Password*"} placeholderTextColor='#fff' secureTextEntry={true} style={styles.TextInput}/>
          <TextInput placeholder={"Confirm password*"} placeholderTextColor='#fff' secureTextEntry={true} style={styles.TextInput}/>
          <TouchableOpacity style={styles.buttonsView}>
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
    backgroundColor:'#000',
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