import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import signUp from './screens/signUp';
import { createStackNavigator} from "@react-navigation/stack";

//will need to import any new screens 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
        <Stack.Screen name="signUp" component={signUp}/>
      </Stack.Navigator>  
    </NavigationContainer>
  );
  
}



