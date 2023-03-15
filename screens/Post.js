//post.js - code to allow users to post jobs to the system.

import { useState, useEffect } from "react";
import React from "react";
import {
  SelectList,
} from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

//function for the main post processing, has navigate to navigate back to the homescreen after a post is made
const Post = ({ navigation }) => {
  //variables for the post
  const [taskDetails, setTaskDetails] = useState("");
  const [price, setPrice] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  //fetch call to retrive the specialities from the database to be displayed in a drop down list
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/specialities.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let counter = 0;
        const newOptions = [];
        //creates an array of objects with the specilities
        //each one needs to be an object so they can have their own key to be easily identified 
        for (let i = 0; i < responseJson.length / 2; i++) {
          let object = {
            key: Number(responseJson[counter]),
            value: responseJson[counter + 1],
          };
          newOptions.push(object);
          counter = counter + 2;
        }
        //sets this array in the specialities variable
        setSpecialities(newOptions);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  //handleSubmit handles when the "post" button is pressed 
  handleSubmit = () => {
    //makes sure all the fields have been filled in
    if (price == 0) {
      alert("You have to set a price");
    } else if (taskTitle == "") {
      alert("You need to add a title");
    } else if (taskDetails == "") {
      alert("You need to add Job details");
    } else if (setSelected == false) {
      alert("You need to add an image");
    } else {
      //once all the fields have been filled in a call is made to post the job to the database
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
          if (responseJson == 1) { //the backend sends the response one if the call is successful
            //resets the variables
            setTaskDetails("");
            setPrice("");
            setSelected(null);
            setTaskTitle("");
            //navigates to the home page once the job is added
            navigation.navigate("Home");
            alert("Job Added Successfully");
          } else if (responseJson == -1) { //sends -1 if the post is unsuccessful
            alert("An error has occured");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      //creates a form of variables to upload the image to the database
      const formData = new FormData();
      formData.append("name", {
        name: selectedImageName,
        type: selectedImageType,
        uri: selectedImage,
      });

      //fetch to save the image to our backend
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/upload.php", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.text())
        .then((responseJson) => {})
        .catch((error) => {
          console.error(error);
        });
    }
  };
  //date pickers for post, not currently used
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  //function for image picker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    //if image is uploaded then the image is proccessed
    if (!result.canceled) {
      let localUri = result.assets[0].uri; //sets the uri of the image
      let filename = localUri.split("/").pop(); //generates a file name for the image

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      //sets the variables for the image to be put into a form and uploaded to the back end
      setSelectedImage(localUri);
      setSelectedImageName(filename);
      setSelectedImageType(type);
      setSelected(true);
      const formData = new FormData();
      formData.append("name", {
        name: filename,
        type: type,
        uri: localUri,
      });
    } else { //lets the uer no if no image is added
      alert("You did not select any image.");
    }
  };

  return (
    <ScrollView style={styles.ScrollView} >
      <View style={styles.container}>
        <View style={styles.taskContainer}>
          <Text style={styles.baseText}>Task title:</Text>
          <TextInput
            style={styles.tasktitleBox}
            placeholder="task Title"
            maxLength={20}
            onChangeText={(taskTitle) => setTaskTitle(taskTitle)}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.baseText}>
              Tell us more about your job:
            </Text>
            <TextInput
              style={styles.taskDetails}
              placeholder="task details"
              maxLength={300}
              multiline={true}
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
              boxStyles={{
                marginVertical: 5,
                backgroundColor: "#EBEBEB",
                borderColor: "#939394",
              }}
            />
          </View>

          <View style={styles.PriceContainer}>
            <Text style={styles.baseText}>Price(per hour):</Text>
            <TextInput
              style={styles.priceBox}
              maxLength={10}
              keyboardType= "phone-pad" //phone pad becuase we only need to enter numbers here
              placeholder="£"
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
    //flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    //alignContent: "center",
    //alignSelf:"auto",
    flexGrow:1
    
  },
  title: {
    flex: 1,
    fontSize: 20,
  },
  taskContainer: {
    //alignItems:"stretch",
    //height:"100%",
    width:"80%",
    maxWidth: '80%',
    //maxHeight:"20%"
  },
  detailsContainer: {
  },
  specialityContainer: {},
  PriceContainer: {},
  ButtonsContainer: {
    justifyContent: "center",
    alignContent: "center",
  },
  taskDetails: {
    backgroundColor: "#EBEBEB",
    paddingBottom: 60,
    borderRadius: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    
  },
  priceBox: {
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  SelectList: {},

  tasktitleBox: {
    backgroundColor: "#EBEBEB",
    marginHorizontal: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
    
    
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
    alignSelf: "center",
  },
  pickImgBtn: {
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
    alignSelf: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
    padding: 10,
  },
  baseText: {
    fontSize: 15,
    marginHorizontal: 1,
    paddingVertical: 1,
    paddingHorizontal: 1,
    marginVertical: 1,
    fontFamily: "sans-serif-medium",
  },
  ScrollView:{
    flex:1,
    alignContent:"center",
    backgroundColor:"#fff"
    

    //backgroundColor:"#fff"
  }
  
});
