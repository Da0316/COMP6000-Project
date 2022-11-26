import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import React, {Component} from 'react';
import { SelectList , MultipleSelectList } from 'react-native-dropdown-select-list';
//import CurrencyFormat from 'react-currency-format';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";


const Post =({ navigation }) =>{
    const [taskDetails, setTaskDetails] = useState("");
    const [selected, setSelected] = React.useState([]);
    const[price,setPrice] = useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const data = [
        {key:'1',value:'Cleaning'},
        {key:'2',value:'Gardening'},
        {key:'3',value:'repairments'},
        {key:'4',value:'Craft'},
        {key:'5',value:'Chores'},
        {key:'6',value:'Beauty'},
    ]

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };

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
                    <View>
                    <Text>task Speciality</Text>
                    <MultipleSelectList  
                        setSelected={(val) => setSelected(val)}
                        data={data}
                        save="value"
                        //onSelect={() => alert(selected)}
                        label ="Categories"
                    />
                    </View>
                    
                    <View style={styles.PriceContainer}>
                    <Text style={styles.price}>Price:</Text>
                    <TextInput
                    style={styles.price}
                    placeholder="£"
                    onChangeText={(price)=>(setPrice)}

                    />
                    </View>

                    <View  style= {styles.dateContainer}>
                        <Text>This job should be done before:</Text>
                        <Button title="Show Prefared date" onPress={showDatePicker} />
                        <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        //onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        />
                    </View>
                    
                
        
            </View>
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
        fontSize: 20
    },
    task:{
        flex:15
    },
    taskDetails:{
        backgroundColor: "white",
        paddingTop:3,
        marginTop:10,
        paddingBottom:60,
        marginBottom:2
    },
    SelectList:{
        backgroundColor:"grey"
    },
    price:{
        marginTop:10

    }
    // title:{
    //     padding:20,
    //     fontSize: 25,
    //     //fontFamily:"Cochin",
    //     marginBottom:50

    // }
    
});
