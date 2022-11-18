import { StatusBar } from "expo-status-bar";
import { createFactory, useState } from "react";
//import CheckBox from "@react-native-community/checkbox";
import React, {Component} from 'react';
import { SelectList , MultipleSelectList } from 'react-native-dropdown-select-list';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

// const initiateState ={
//     Cleaning : false,
//     Gardening :false,
//     Craft :false,
//     repairments: false,
//     Chores : false,
//     Beauty: false,
// };

const Post =({ navigation }) =>{
    const [taskDetails, setTaskDetails] = useState("");
    //const [isSelected, setSelection] = useState(false);
    const [selected, setSelected] = React.useState([]);

    const data = [
        {key:'1',value:'Cleaning'},
        {key:'2',value:'Gardening'},
        {key:'3',value:'repairments'},
        {key:'4',value:'Craft'},
        {key:'5',value:'Chores'},
        {key:'6',value:'Beauty'},
    ]


    return(
        <View style={styles.container}>
            <Text style={styles.title}>post Task</Text>
            <View style={styles.task}>
                <Text>Tell us more about what are you looking for.</Text>

                    <TextInput
                    style={styles.taskDetails}
                    placeholder="  taskDetails"
                    placeholderTextColor={'#3c3744'}
                    onChangeText={(taskDetails) => setuserName(setTaskDetails)}
                    />
                    <MultipleSelectList  
                        setSelected={(val) => setSelected(val)}
                        data={data}
                        save="value"
                        //onSelect={() => alert(selected)}
                        label ="Categories"
                    />
            </View>
             
                
            
            {/* <View>
            <CheckBox
              value={state.react}
              onValueChange={value =>
                setState({
                  ...state,
                  Cleaning: value,
                })
              }
            />
            <Text>Cleaning</Text>
          </View> */}
            
        </View>


    )


}

export default Post;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"#F3F3F3",
        alignItems: 'center',
        
 
    },
    title:{
        flex:1,
       // marginTop: 5,
        fontSize: 20
    },
    task:{
        flex:15
    },
    taskDetails:{
        backgroundColor: "white",
        paddingTop:3,
        marginTop:10,
        paddingBottom:70,
        marginBottom:30
    },
    SelectList:{
        backgroundColor: "grey"
    }
    
});
