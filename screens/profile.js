import  React, {useState, useEffect} from 'react';
import { View,SafeAreaView,StyleSheet, ScrollView} from 'react-native';
import { Avatar,Title,Caption,Text, TouchableRipple, TextInput} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Login from '../chatroom_testing/Login';

const Profile=({navigation}) =>{
      //const {userID, setUserID} = useState(null);
      const [username, setUsername] = useState('');
      const [firstname, setFirstname] = useState(null);
      const [lastname, setLastname] = useState(null);
      const [date_of_birth, setDate_of_birth] = useState(null);
      const [address, setAddress] = useState(null);
      const[email, setEmail] = useState(null);
      const [phone_number, setPhone_number] = useState(null);
      const [selectedImageName, setSelectedImageName] = useState('2846608f-203f-49fe-82f6-844a3f485510.png');

      useEffect(() => { 
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
            method: 'post',
            header: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                //userID: 1
                userID: userID
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson[0]);
          //setUserID(responseJson[0])
          setUsername(responseJson[1])
          setFirstname(responseJson[2]);
          setLastname(responseJson[3]);
          setDate_of_birth(responseJson[4]);
          setAddress(responseJson[5]);
          setEmail(responseJson[6]);
          setPhone_number(responseJson[7]);
          if(responseJson[8] == null){
          }
          else{
            setSelectedImageName (responseJson[8]);
          }
          
        })
        .catch((error) => {
            console.log(error);
        })  }, []);
    // console.log(userID);
    // console.log(firstname);
    // console.log(lastname);
    // console.log(address);
    // console.log(phone_number);
    // console.log(email);
    // console.log(date_of_birth);
  return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.userInfoSection}>
              <View style={{flexDirection:'row', marginTop: 15}}>
                  <Avatar.Image
                      source={{
                          uri: 'https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/'+ selectedImageName,
                      }}
                      size={90} />
                  <View style= {{marginLeft:20}}>
                      <Title style={[styles.title,{
                          marginTop:15,
                          marginBottom:5,
                      }]}>{firstname} {lastname}</Title>
                      <Caption style={styles.caption}>{username}</Caption>
                  </View>
              </View> 
          </View>

          <View style={styles.userInfoSection}>
              <View style={styles.row}>
              <Icon name="map-marker-radius"color="#1A1918" size={20}/>
              <Text style={{color:"#1A1918", marginLeft:20}}>{address}</Text>
              </View>
              <View style={styles.row}>
              <Icon name="phone"color="#1A1918" size={20}/>
              <Text style={{color:"#1A1918", marginLeft:20}}>{phone_number}</Text>
              </View>
              <View style={styles.row}>
              <Icon name="email"color="#1A1918" size={20}/>
              <Text style={{color:"#1A1918", marginLeft:20}}>{email}</Text>
              </View>
              <View style={styles.row}>
              <Icon name="calendar"color="#1A1918" size={20}/>
              <Text style={{color:"#1A1918", marginLeft:20}}>{date_of_birth}</Text>
              </View>

              <View style={styles.userBtnWrapper}>
              <TouchableRipple style={styles.logoutBtn} onPress={()=>navigation.navigate('Login')}>
                  <Text style={styles.userBtnTxt}> Logout</Text>
                </TouchableRipple>
                <TouchableRipple style={styles.userBtn} onPress={()=>navigation.navigate('EditProfile')}>
                  <Text style={styles.userBtnTxt}> Edit Profile</Text>
                </TouchableRipple>
                <TouchableRipple style={styles.userBtn} onPress={()=>navigation.navigate('ViewJobsAndApps')}>
                  <Text style={styles.userBtnTxt}>View Jobs/Applications</Text>
                </TouchableRipple>
              </View>

          <View style={styles.infoBoxWrapper}>
             <View style={styles.infoBox}>
               <Text style={styles.title2}>Ratings Level</Text>
               <Caption style={styles.titlenum}>1</Caption>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.title2} >Jobs Completed</Text>
              <Caption style={styles.titlenum}>1</Caption>
            </View>
           </View>
          </View>

          <View style={styles.reviewSection}>
            <Icon name="message-draw"color="#1A1918" size={30}/>
            <Title style={{fontWeight:'bold'}}> Write Reviews</Title>
            <TextInput
            style={styles.reviewForm}
            placeholder="Write Review"
            placeholderTextColor={'#777777'}
            />
          </View >
          </ScrollView>
      </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#FFFFFF",
    
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title2:{
    flexDirection: 'column',
    fontSize:16,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:2,
    textAlign:'center'
  },
  titlenum:{
    fontSize:16

  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
  },
  infoBox: {
    //fontSize:6,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    margin:8,
    paddingHorizontal:3,
    //flexDirection: 'column',
    //position: "absolute",
    width:100,
    height:100,
    borderRadius:1000,
    backgroundColor: "#C2C3C4",
    transform:[
      {translateX:0},
      {translateY:0},
      {rotate:"0deg"},
    ]
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop:3,
  },
  userBtn: {
    backgroundColor: '#1a1918',
    color: "#FFFFF",
    borderRadius:25,
    justifyContent:"center",
    height: 30,
    //alignItems:"center",
    //borderWidth: 2,
    //borderRadius: 3,
    paddingHorizontal: 10,
    marginHorizontal: 3,
  },
  userBtnTxt: {
    color: '#FFFFFF'
  },

  reviewForm:{
    backgroundColor: "white",
    paddingTop:3,
    marginTop:8,
    paddingBottom:40
  },
  reviewSection:{
    alignItems:"center"

  },logoutBtn:{
    backgroundColor: '#b28b1d',
    color: "#FFFFF",
    borderRadius:25,
    justifyContent:"center",
    height: 30,
    //alignItems:"center",
    //borderWidth: 2,
    //borderRadius: 3,
    paddingHorizontal: 10,
    marginHorizontal: 3,

  }
});