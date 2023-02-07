import React, { useState, useEffect } from "react";
import { View,
        Text,
        Button,
        TouchableOpacity, 
        ImageBackground,
        TextInput, 
        StyleSheet 
        } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';





const EditProfile = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email,setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhone_number] = useState('');



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
          setAddress(responseJson[5]);
          setEmail(responseJson[6]);
          setPhone_number(responseJson[7]);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const handelSubmit = () => {
      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/editProfile.php', {
        method: 'patch',
        header:{
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          
          username: username,
          firstname: firstname,
          lastname: lastname,
          email: email,
          address: address,
          phone: phone_number,
        }),
        catch(error){
          alert("Error");
        }
      })

    };
        
    return (
        <View style={styles.container}>
            <View style={{margin: 20}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {}}>
                        <View style={{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <ImageBackground
                                source={{
                                uri:'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YmFja2dyb3VuZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
                                }}
                                style={{height:100, width:100}}
                                imageStyle={{borderRadius:100/2}}
                                >
                                     <View style={{
                                         flex: 1,
                                         justifyContent:'center',
                                         alignItems: 'center',
                                     }}>

                                        <Icon name="camera" size={35} color="#fff" style={{
                                            opacity: 0.7,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            borderRadius: 10,
                                        }}/>
                                    </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
                      {firstname} {lastname}
                    </Text>
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" size={20} />
                    <TextInput 
                    placeholder= {firstname}
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={styles.textInput}
                    value={firstname}
                    onChangeText={setFirstname}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" size={20} />
                    <TextInput 
                    placeholder="Last Name"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={styles.textInput}
                    value={lastname}
                    onChangeText={setLastname}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" size={20} />
                    <TextInput 
                    placeholder="Username"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={styles.textInput}
                    value={username}
                    onChangeText={setUsername}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="phone" size={20} />
                    <TextInput 
                    placeholder="Phone"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    autoCorrect={false}
                    style={styles.textInput}
                    value={phone_number}
                    onChangeText={setPhone_number}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="envelope-o" size={20} />
                    <TextInput 
                    placeholder="Email"
                    placeholderTextColor="#666666"
                    keyboardType="email-address"
                    autoCorrect={false}
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    />
                </View>
                <View style={styles.action}>
                    <Icon name="map-marker-outline" size={20} />
                    <TextInput 
                    placeholder="Address"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={styles.textInput}
                    value={address}
                    onChangeText={setAddress}
                    />
                </View>
                <TouchableOpacity style={styles.commandButton} onPress={() => handelSubmit()}> 
                    <Text style={styles.panelButtonTitle}>UPDATE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    commandButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginTop: 10,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      // elevation: 5,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'android' ? -2 : -12,
      paddingLeft: 10,
      color: '#055a39',
    },
  });