// import * as React from 'react';
// import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { View } from 'react-native';

// //screens imports
// import HomeScreen from './screens/homeScreen';
// import Login from './screens/login';
// import SignUp from './screens/SignUp';
// //import ChatApp from './chatroom_testing/ChatApp';
// import Post from './screens/Post';
// import NavContainter from './NavContainter';

// //screen consts
// //const home = 'Home';
// //onst postName = 'Post';

// const Bar = createBottomTabNavigator();

// // initialRouteName={home}
// //         screenOptions={({ route}) => ({
// //             tabBarIcon: ({focused, color, size}) => {
// //                 let iconName;
// //                 let rn = route.name;

// //                 if (rn === home){
// //                     iconName = focused ? 'home' : 'home-outline'
// //                 } else if (rn === home){
// //                     iconName = focused ? 'post' : 'post-outline'
// //                 }
// //                 //do the same for the other pages

// //                 return <Ionicons name={iconName} size={size} color={color}/>
// //             },

// //         })}
// const TabNav = () =>{
//     return(
//     <Bar.Navigator >
//         <Bar.Screen name="HomeScreen" component={MainNavContainter}/>    
//     </Bar.Navigator>);
// };
// export default TabNav;