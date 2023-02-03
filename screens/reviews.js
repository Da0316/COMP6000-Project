import  React, {useState} from 'react';
import { View,SafeAreaView,StyleSheet, ScrollView,} from 'react-native';
import { Avatar,Title,Caption,Text, TouchableRipple, TextInput } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Login from '../chatroom_testing/Login';

const Reviews=({navigation}) =>{
      //const {userID, setUserID} = useState(null);
      //const [username, setUsername] = useState('');
      //const [firstname, setFirstname] = useState(null);
      //const [lastname, setLastname] = useState(null);
      //const [date_of_birth, setDate_of_birth] = useState(null);
      //const [address, setAddress] = useState(null);
      //const[email, setEmail] = useState(null);
      //const [phone_number, setPhone_number] = useState(null);

      
  return (
      <SafeAreaView style={styles.container}>
        <ScrollView>

        </ScrollView>
          <View style={styles.reviewSection}>
          <Title style={{fontWeight:'bold', marginLeft:20,}}> Write Reviews</Title>
          <TextInput
          style={styles.reviewForm}
          placeholder="Write Review"
          placeholderTextColor={'#777777'}
          />
          </View >
      </SafeAreaView>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#F3F3F3",
    
  },

  reviewForm:{
    backgroundColor: "white",
    paddingTop:3,
    marginTop:10,
    paddingBottom:60
  }
});