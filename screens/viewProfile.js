import  React, {useState,useEffect} from 'react';
import { View,SafeAreaView,StyleSheet,ScrollView} from 'react-native';
import { Avatar,Title,Caption,Text, TouchableRipple, TextInput } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ViewJob from "../components/ViewJob";

const ViewProfile=({navigation,route}) =>{

      const [username, setUsername] = useState('');
      const [firstname, setFirstname] = useState(null);
      const [lastname, setLastname] = useState(null);
      const [phone_number, setPhone_number] = useState(null);
      const [selectedImageName, setSelectedImageName] = useState('2846608f-203f-49fe-82f6-844a3f485510.png');
      const [placeholder, setImagePlaceholder] = useState(false);
      const [jobsCompleted, setJobsCompleted] = useState(null);
      const [score, setScore] = useState(null);

      try {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php', {
            method: 'post',
            header: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                //userID: 1
                userID : route.params.paramKey,
                username: username,
                firstname: firstname,
                lastname:lastname,
                phone_number: phone_number,
                
                
            }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          setUsername(responseJson[1])
          setFirstname(responseJson[2]);
          setLastname(responseJson[3]);
          setPhone_number(responseJson[7]);
          if(responseJson[8] == null){
            setImagePlaceholder(true)
          }
          else{
            if(responseJson[8]==="blank"){
                setImagePlaceholder(true)
            }else{
              setImagePlaceholder(false)
            setSelectedImageName (responseJson[8]);
            }
          }
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
        
    }

    const [jobID, setJobID] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJobEmpty, setIsJobEmpty] = useState(false);

    const JobView = () => (
        <ScrollView>
            {jobID.map(object => {
                return <ViewJob key={object.id} ID={object.id}/>
            })}
        </ScrollView>
    );

    
    const emptyJobView = () => (
        <View>
            <Text>No Jobs Posted</Text>
        </View>
    )

    
   useEffect(() => {
        fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/getJobs.php', {
        method: 'post',
        header: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: route.params.paramKey,
        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson == -1){
                setIsJobEmpty(true)
            } else {
                const ids = [];
                for (let i = 0; i < responseJson.length; i++){
                    let object = {
                        id: responseJson[i],
                    };
                    ids.push(object)
                };
                setJobID(ids);  
            }
            setIsLoading(false);
        })
        .catch((error) => {
            alert(error);
        });
    }, []);

    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateReviewScore.php', {
      method: 'post',
      header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         userID: route.params.paramKey,
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          setScore(responseJson);
       })
      .catch((error) => {
          alert(error);
      });

      fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/calculateJobsCompleted.php', {
      method: 'post',
      header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         userID: route.params.paramKey,
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          setJobsCompleted(responseJson);
       })
      .catch((error) => {
          alert(error);
      });
   
  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.userInfoSection}>
              <View style={{flexDirection:'row', marginTop: 2}}>
                  <Avatar.Image
                      source={{
                        uri:placeholder?
                         'https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/'+ selectedImageName: 'https://raptor.kent.ac.uk/proj/comp6000/project/08/'+ selectedImageName,
                      }}
                      size={60} />
                  <View style= {{marginLeft:12}}>
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
              <Text style={{color:"#1A1918", marginLeft:20}}>{phone_number}</Text>
              </View>

              <View style={styles.userBtnWrapper}>
                <TouchableRipple style={styles.userBtn} onPress={()=>navigation.navigate('Chat')}>
                  <Text style={styles.userBtnTxt}>Message</Text>
                </TouchableRipple>
                <TouchableRipple style={styles.userBtn} onPress={()=>navigation.navigate('Reviews', { jobId: route?.params?.jobID,userPostedID: route.params.paramKey })}>
                  <Text style={styles.userBtnTxt}>Reviews</Text>
                </TouchableRipple>
              </View>
          <View style={styles.infoBoxWrapper}>
             <View style={[styles.infoBox, {
              borderRightColor: '#dddddd',
              borderRightWidth: 1
               }]}>
               <Title style={styles.title2}>Ratings Level</Title>
               <Caption>{score}</Caption>
            </View>
         <View style={styles.infoBox}>
          <Title style={styles.title2}>Jobs Completed</Title>
          <Caption>{jobsCompleted}</Caption>
         </View>
           </View>
          </View>
          <View style={styles.scrollViewContainer}>
            <Text style={{fontSize: 24,
              fontWeight: 'bold',
              marginLeft:15}}>Needed Tasks</Text>
            <ScrollView>
            <ScrollView horizontal = {true}>
                      {jobID.map(object => {
                        return <ViewJob key = {object.id} ID={object.id} />
                      })}
                  </ScrollView>
            </ScrollView>
          </View>

          
        

      </SafeAreaView>
  );
};

export default ViewProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#FFFFFF",
    
  },
  userInfoSection: {
    paddingHorizontal: 30,
    paddingVertical:10,
    marginBottom: 5,
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
    // borderBottomColor: '#dddddd',
    // borderBottomWidth: 1,
    // borderTopColor: '#dddddd',
    // borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical:10,
    //height: 60,
    justifyContent:"space-between",
    height:90

  },
  infoBox: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal:30,
    paddingHorizontal:3,
    //paddingVertical:10,
    elevation:5,
    width:100,
    height:100,
    borderRadius:200,
    backgroundColor: "#f9ce40",
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
    paddingVertical:10,
    
    
  },
  userBtn: {
    // borderColor: '#2e64e5',
    // borderWidth: 2,
    // borderRadius: 3,
    // paddingVertical: 10,
    backgroundColor: '#1a1918',
    color: "#FFFFF",
    borderRadius:25,
    justifyContent:"center",
    height: 30,
    elevation:5,
    paddingHorizontal: 10,
    marginHorizontal: 30,
  },
  userBtnTxt: {
    color: '#FFFFFF',
    marginHorizontal:15
  },

  reviewForm:{
    backgroundColor: "white",
    paddingTop:3,
    marginTop:10,
    paddingBottom:60
  },
  title2:{
    flexDirection: 'column',
    fontSize:16,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:2,
    textAlign:'center',
    fontFamily:"sans-serif-medium"

  },
  scrollViewContainer:{
    paddingVertical:40,
    flexGrow:2
    //flex:2,
    
  }
  
});
