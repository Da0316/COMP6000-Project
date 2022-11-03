import { StatusBar } from "expo-status-bar";
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




const Login = ({navigation}) =>{
  const [userName,setuserName] =useState('');
  const [password,setpassword] =useState('');

  const handleSubmit =() => {
    if (!userName) {
        alert('Please fill Username');
        return;
      }
      if (!password) {
        alert('Please fill Password');
        return;
      }

    if (userName == 'admin' && password == '123'){
        navigation.navigate('HomeScreen');
    }else{
        alert('invalid login details, please try agan');
    }

}
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

      <TouchableOpacity style={styles.LoginBtn} onPress={handleSubmit}>
        <Text style={styles.LoginText}>Login</Text>
      </TouchableOpacity>

    <Text>Don't have an account?</Text>
      <TouchableOpacity style={styles.LoginBtn} onPress={()=>navigation.navigate('signUp')}>
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
    fontFamily:"Cochin",
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