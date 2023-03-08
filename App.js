import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import SignUp from "./screens/signUp";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/homeScreen";
import Login from "./screens/login";
import ChatApp from "./chat_system/ChatApp";
import Post from "./screens/Post";
import Profile from "./screens/profile";
import EditProfile from "./screens/editProfile";
import job from "./screens/job";
import createApplication from "./screens/createApplication";
import selectSpecialities from "./screens/selectSpecialities";
import ViewJobsAndApps from "./screens/viewJobsAndApps";
import jobApplications from "./screens/jobApplications";
import application from "./screens/application";
import viewProfile from "./screens/viewProfile";
import Reviews from "./screens/reviews";
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchScreen from "./screens/SearchScreen";
import ForgotPassword from "./screens/ForgotPassword";
console.disableYellowBox = true;
console.reportErrorsAsExceptions = false;

//will need to import any new screens
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import NavContainer from './navigation/NavContainter';
//import TabNav from './navigation/TabNav';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const firebaseConfig = {
  apiKey: "AIzaSyCZonqQoeCQB8l_Cze3DRmCoZgeKMNvl10",
  authDomain: "chat-screen-aca22.firebaseapp.com",
  databaseURL: "https://chat-screen-aca22-default-rtdb.firebaseio.com",
  projectId: "chat-screen-aca22",
  storageBucket: "chat-screen-aca22.appspot.com",
  messagingSenderId: "921334264296",
  appId: "1:921334264296:web:523920ad64647e74b5f45d",
  measurementId: "G-NDMVXR7NKP",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const Tab = createBottomTabNavigator();

function StackScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Profile") {
            iconName = focused
              ? "ios-person-circle"
              : "ios-person-circle-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          } else if (route.name === "Post task") {
            iconName = focused ? "ios-add-circle" : "ios-add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#f9ce40",
        tabBarInactiveTintColor: "#1a1918",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post task" component={Post} />
      <Tab.Screen name="Chat" component={ChatApp} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App(navigation) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="SelectSpecialities"
          component={selectSpecialities}
        />
        <Stack.Screen name="Job" component={job} />
        <Stack.Screen name="CreateApplication" component={createApplication} />
        <Stack.Screen name="JobApplications" component={jobApplications} />
        <Stack.Screen name="Application" component={application} />
        <Stack.Screen name="ViewJobsAndApps" component={ViewJobsAndApps} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={StackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Chat" component={ChatApp} />
        <Stack.Screen name="ViewProfile" component={viewProfile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Reviews" component={Reviews} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
