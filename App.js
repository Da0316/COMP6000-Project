import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import signUp from './screens/signUp';
import { createStackNavigator} from "@react-navigation/stack";
import HomeScreen from './screens/homeScreen';
import Login from './screens/login';

//will need to import any new screens 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Signup" component={signUp}/>

        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      </Stack.Navigator>  
    </NavigationContainer>
    
  );

  
  
}



