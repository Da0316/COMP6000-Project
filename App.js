import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import RegisterScreen from './screens/RegisterScreen';
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Chat" component={ChatScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
} 

