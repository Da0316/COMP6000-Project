import  React, {useState} from 'react';
import { View,SafeAreaView,StyleSheet,} from 'react-native';
import { Avatar,Title,Caption,Text, TouchableRipple, TextInput } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Login from '../chatroom_testing/Login';

//data can be passed between react screens and components using props or routes
const ViewProfile = ({user}) => {
    const [username,setUsername] =useState('');
    const [firstname,setFirstname] =useState('');
    const [lastname,setLastname] =useState('');
    const [phone_number, setPhone_number] =useState('');

    //fetch data for the job from the database
    //need to create an API for this

    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/viewProfile.php', { //needs to be changed to your own ip
          method: 'post', 
          header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            firstname: firstname,
            lastname: lastname,
            phone: phone_number,

          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //sets the variables
            //console.log(responseJson);
            setUsername(responseJson[1]);
            setFirstname(responseJson[3]);
            setLastname(responseJson[4]);
            setPhone_number(responseJson[7]);
            
          })
          .catch((error) => {
            console.error(error);
          });
        
    return(

            <SafeAreaView style={styles.container}>
                <View style={styles.userInfoSection}>
                    <View style={{flexDirection:'row', marginTop: 15}}>
                        <Avatar.Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YmFja2dyb3VuZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
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
                    <Icon name="phone"color="#777777" size={20}/>
                    <Text style={{color:"#777777", marginLeft:20}}>{phone_number}</Text>
                    </View>
                    <View style={styles.userBtnWrapper}>
                      <TouchableRipple style={styles.userBtn} onPress={()=>navigation.navigate('ViewJobsAndApps')}>
                        <Text style={styles.userBtnTxt}>View Jobs/Applications</Text>
                      </TouchableRipple>
                    </View>
      
                <View style={styles.infoBoxWrapper}>
                   <View style={[styles.infoBox, {
                    borderRightColor: '#dddddd',
                    borderRightWidth: 1
                     }]}>
                     <Title>Ratings Level</Title>
                     <Caption>1</Caption>
                  </View>
               <View style={styles.infoBox}>
                <Title>Jobs Completed</Title>
                <Caption>1</Caption>
               </View>
                 </View>
                </View>
      
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
      
      export default ViewProfile;
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor:"#F3F3F3",
          
        },
        userInfoSection: {
          paddingHorizontal: 30,
          marginBottom: 25,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
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
          borderBottomColor: '#dddddd',
          borderBottomWidth: 1,
          borderTopColor: '#dddddd',
          borderTopWidth: 1,
          flexDirection: 'row',
          height: 100,
        },
        infoBox: {
          width: '50%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        userBtnWrapper: {
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginBottom: 20,
          marginTop:20,
        },
        userBtn: {
          borderColor: '#2e64e5',
          borderWidth: 2,
          borderRadius: 3,
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginHorizontal: 5,
        },
        userBtnTxt: {
          color: '#2e64e5'
        },
      
        reviewForm:{
          backgroundColor: "white",
          paddingTop:3,
          marginTop:10,
          paddingBottom:60
        }
      });