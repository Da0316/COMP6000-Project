import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './screens/SignUp';
import { createStackNavigator} from "@react-navigation/stack";
import HomeScreen from './screens/homeScreen';
import Login from './screens/login';
import ChatApp from './chatroom_testing/ChatApp';
import Post from './screens/Post';

//will need to import any new screens 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCZonqQoeCQB8l_Cze3DRmCoZgeKMNvl10",
  authDomain: "chat-screen-aca22.firebaseapp.com",
  databaseURL: "https://chat-screen-aca22-default-rtdb.firebaseio.com",
  projectId: "chat-screen-aca22",
  storageBucket: "chat-screen-aca22.appspot.com",
  messagingSenderId: "921334264296",
  appId: "1:921334264296:web:523920ad64647e74b5f45d",
  measurementId: "G-NDMVXR7NKP"
};

// Initialize Firebase
initializeApp(firebaseConfig);





const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
<<<<<<< HEAD
        <Stack.Screen name="SignUp" component={SignUp}/>
=======
        <Stack.Screen name="Signup" component={signUp}/>
        <Stack.Screen name="Post" component={Post}/>
>>>>>>> workingproject
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      </Stack.Navigator>  
    </NavigationContainer>
  );  
}

//this is to test the chat functionality, DONT DELETE
/*export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = "Chat" component ={ChatApp}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/



