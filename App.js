import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './screens/signUp'; 
import { createStackNavigator} from "@react-navigation/stack";
import HomeScreen from './screens/homeScreen';
import Login from './screens/login';
import ChatApp from './chatroom_testing/ChatApp';
import Post from './screens/Post';
import Profile from './screens/profile';
import EditProfile from './screens/editProfile';
import nav from './navigation/NavContainter';
import job from './screens/job'
import createApplication from './screens/createApplication'
import selectSpecialities from './screens/selectSpecialities'
import ViewJobsAndApps from './screens/viewJobsAndApps';
import jobApplications from './screens/jobApplications';
import application from './screens/application';
import viewProfile from './screens/viewProfile';

 


//will need to import any new screens 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import NavContainer from './navigation/NavContainter';
//import TabNav from './navigation/TabNav';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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


// {/* <NavigationContainer>
//      <Stack.Navigator>
//         <Stack.Screen name="Login" component={Login}/>
//         <Stack.Screen name="SignUp" component={SignUp}/>
//         <Stack.Screen name="Post" component={Post}/>
//         <Stack.Screen name="HomeScreen" component={HomeScreen}/>
//       </Stack.Navigator>  
//     </NavigationContainer> */}

const Tab = createBottomTabNavigator();

function StackScreen(){
  //const Tab = createBottomTabNavigator
  return(
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Post" component={Post}/>
      <Tab.Screen name="Chat" component={ChatApp}/>
      <Tab.Screen name="Profile" component={Profile}/>
    </Tab.Navigator>
  );
}

/*function ProfileStack() {
  return(
    <Stack.Navigator>
    <Stack.Screen name="Profile"  component={Profile} options={{headerShown: false }}/>
    <Stack.Screen name="EditProfile"  component={EditProfile} />
    </Stack.Navigator>
  );
}*/

const Stack = createStackNavigator();
//<NavContainter/>
export default function App(navigation) {

 
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="SelectSpecialities" component={selectSpecialities}/>
        <Stack.Screen name="Job" component={job}/>
        <Stack.Screen name="CreateApplication" component={createApplication}/>
        <Stack.Screen name="JobApplications" component={jobApplications}/>
        <Stack.Screen name="Application" component={application}/>
        <Stack.Screen name="ViewJobsAndApps" component={ViewJobsAndApps}/>
        <Stack.Screen name="Profile"  component={Profile} options={{headerShown: false }}/>
        <Stack.Screen name="HomeScreen" component={StackScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="EditProfile"  component={EditProfile} />
        <Stack.Screen name="ViewProfile" component={viewProfile}/>

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


