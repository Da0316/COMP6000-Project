import { useState, useEffect } from "react";
import React from "react";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView
} from "react-native";

const Post = ({ navigation }) => {
  const [taskDetails, setTaskDetails] = useState('');
  const [price, setPrice] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [specialities, setSpecialities] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  useEffect(() => {
    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/specialities.php', {
      method: 'post',
      header: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let counter = 0;
        const newOptions = [];
        for (let i = 0; i < responseJson.length / 2; i++) {
          let object = {
            key: Number(responseJson[counter]),
            value: responseJson[counter + 1],
          };
          newOptions.push(object);
          counter = counter + 2;
        }
        setSpecialities(newOptions);
      })
      .catch((error) => {
        alert(error);
      });
    }, []);


  handleSubmit = () => {
    
    if (price == 0) {
      alert("You have to set a price");
    }else if(taskTitle ==''){
      alert("You need to add a title");
    }else if(taskDetails == ''){
      alert("You need to add Job details");
    }else if (setSelected == false){
      alert("You need to add an image");
    }else {
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/post.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
            taskT: taskTitle,
            taskD: taskDetails,
            p: price,
            ID: global.userID,
            speciality: selectedSpecialties,
            image: selectedImageName,
        }),
      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson == 1){
            
            
            setTaskDetails('');
            setPrice('');
            setSelected(null);
            setTaskTitle('');
            navigation.navigate("Home");
            alert("Job Added Successfully");
          } else if (responseJson == -1){
            alert("An error has occured")
          }
        })
        .catch((error) => {
          console.error(error);
        });
        
        //console.log(selectedImage);
        const formData = new FormData();
        formData.append('name', {
          name: selectedImageName, 
          type: selectedImageType, 
          uri: selectedImage });
          //console.log (formData);
          fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/upload.php',{
            method: 'POST',
            
            // body: JSON.stringify({
            //   name: filename, 
            //   type: type, 
            //   uri: localUri
            // }),
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        }).then((response) => response.text())
          .then((responseJson) => {
            console.log(responseJson);
          
        }).catch((error) => {
          console.error(error);
        });
      }


  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  

  //image picker added 
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      //setSelectedImage(result.assets[0].uri);
      //console.log(result);
      //setSelectedImage(result);




      //
      //handleSubmit();
      let localUri = result.assets[0].uri;
      let filename = localUri.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      //console.log(localUri);
      setSelectedImage(localUri);
      setSelectedImageName(filename);
      setSelectedImageType(type);
      setSelected(true);
      const formData = new FormData();
      formData.append('name', {
          name: filename, 
          type: type, 
          uri: localUri });
      

      //console.log(localUri);
      //console.log(formData);
      //useEffect(() => {
    //   fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/upload.php',{
    //     method: 'POST',
        
    //     // body: JSON.stringify({
    //     //   name: filename, 
    //     //   type: type, 
    //     //   uri: localUri
    //     // }),
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     body: formData
    // }).then((response) => response.text())
    //   .then((responseJson) => {
    //     console.log(responseJson);
      
    // }).catch((error) => {
    //   console.error(error);
    // });
 //});
    } else {
      alert('You did not select any image.');
    }
  
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.taskContainer}>
          <Text style={styles.baseText}>Task title:</Text>
          <TextInput
            style={styles.tasktitleBox}
            placeholder="task Title"
            onChangeText={(taskTitle) => setTaskTitle(taskTitle)}
          />
          <View style={styles.detailsContainer}>
          <Text style={styles.baseText}>Tell us more about what are you looking for.</Text>
          <TextInput
            style={styles.taskDetails}
            placeholder="task details"
            //placeholderTextColor={"#3c3744"}
            onChangeText={(taskDetails) => setTaskDetails(taskDetails)}
          />
          </View>
          <View style={styles.specialityContainer}>
            <Text style={styles.baseText}>Task speciality:</Text>
            <SelectList
              setSelected={(val) => setSelectedSpecialties(val)}
              data={specialities}
              save="value"
              label="Categories"
              boxStyles={{marginVertical:5,backgroundColor:"#EBEBEB",borderColor:"#939394"}}
            />
          </View>

          <View style={styles.PriceContainer}>
            <Text style={styles.baseText}>Price(per hour):</Text>
            <TextInput
              style={styles.priceBox}
              placeholder="£"
              //placeholderTextColor={"#3c3744"}
              onChangeText={(price) => setPrice(price)}
            />
          </View>
          <View style={styles.ButtonsContainer}>
          <TouchableOpacity
            style={styles.pickImgBtn}
            onPress={() => pickImageAsync()}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
          </View>
          
          
        </View>
      </View>
    </ScrollView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
  },
  taskContainer: {
    
  },
  detailsContainer:{
    //flex:5

  },specialityContainer :{

  },PriceContainer:{
    

  },ButtonsContainer:{
    justifyContent: "center",
    alignContent:"center",

  },taskDetails: {
    backgroundColor: "#EBEBEB",
    paddingBottom: 60,
    borderRadius:20,
    marginVertical: 10,
    paddingHorizontal:10,
  },
  priceBox:{
    backgroundColor: "#EBEBEB",
    borderRadius:15,
    marginVertical: 10,
    paddingHorizontal:10,
  },
  SelectList: {

  },
  
  tasktitleBox: {
    backgroundColor: "#EBEBEB",
    marginHorizontal:5,
    paddingHorizontal:10,
    marginVertical: 10,
    borderRadius:20
  },
  postBtn: {
    width: "90%",
    color: "#000",
    height: 50,
    backgroundColor: "#f9ce40",
    borderRadius: 10,
    marginVertical: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    alignSelf:"center",
  },
  pickImgBtn:{
    width: "90%",
    color: "#000",
    height: 50,
    backgroundColor: "#939394",
    borderRadius: 10,
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    alignSelf:"center",

  },buttonText: {
    fontWeight: "bold",
    fontSize: 15,
    padding: 10,
  },
  baseText:{
    fontSize: 15,
    marginHorizontal:1,
    paddingVertical:1,
    paddingHorizontal:1,
    marginVertical: 1,
    fontFamily:"sans-serif-medium"

  }
});
