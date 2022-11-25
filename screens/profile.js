import React from 'react';
import { View,SafeAreaView,StyleSheet} from 'react-native';
import { Avatar,Title,Caption,Text, TouchableRipple } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


function Profile() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.userInfoSection}>
                <View style={{flexDirection:'row', marginTop: 15}}>
                    <Avatar.Image
                        source={{
                            uri: '',
                        }}
                        size={90} />
                    <View style= {{marginLeft:20}}>
                        <Title style={[styles.title,{
                            marginTop:15,
                            marginBottom:5,
                        }]}>David Addo</Title>
                        <Caption style={styles.caption}>dadd03</Caption>
                    </View>
                </View>
            </View>

            <View style={styles.userInfoSection}>
                <View style={styles.row}>
                <Icon name="map-marker-radius"color="#777777" size={20}/>
                <Text style={{color:"#777777", marginLeft:20}}>Canterbury, Kent</Text>
                </View>
                <View style={styles.row}>
                <Icon name="phone"color="#777777" size={20}/>
                <Text style={{color:"#777777", marginLeft:20}}>07392533283</Text>
                </View>
                <View style={styles.row}>
                <Icon name="email"color="#777777" size={20}/>
                <Text style={{color:"#777777", marginLeft:20}}>addo003.da@gmail.com</Text>
                </View>
                <View style={styles.row}>
                <Icon name="calendar"color="#777777" size={20}/>
                <Text style={{color:"#777777", marginLeft:20}}>16/03/2000</Text>
                </View>

                <View style={styles.userBtnWrapper}>
                  <TouchableRipple style={styles.userBtn} onPress={() =>{}}>
                    <Text style={styles.userBtnTxt}> Message</Text>
                  </TouchableRipple>
                  <TouchableRipple style={styles.userBtn} onPress={() =>{}}>
                    <Text style={styles.userBtnTxt}> Edit Profile</Text>
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
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      paddingHorizontal: 50,
      marginHorizontal: 5,
    },
    userBtnTxt: {
      color: '#2e64e5'
    }
  });