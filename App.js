import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import signUp from './screens/signUp';
import { createStackNavigator} from "@react-navigation/stack";
import HomeScreen from './screens/homeScreen';
import Login from './screens/login';

//will need to import any new screens 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="signUp" component={signUp}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      </Stack.Navigator>  
    </NavigationContainer>
  );
  
}



