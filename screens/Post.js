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
    //console.log(selectedImage);
    if (price == 0) {
      alert("You have to set a price");
    }else if(taskTitle ==''){
      alert("You need to add a title");
    }else if(taskDetails == ''){
      alert("You need to add Job details");
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
            speciality: selected,
            image: selectedImageName,
        }),
      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson == 1){
            
            alert("Job Added Successfully");
            setTaskDetails('');
            setPrice('');
            setSelected(null);
            setTaskTitle('');
          navigation.navigate("HomeScreen");
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
        <Text style={styles.title}>post Task</Text>

        <View style={styles.task}>
          <Text>Task title</Text>

          <TextInput
            style={styles.tasktitleBox}
            placeholder="  task Title"
            placeholderTextColor={"#3c3744"}
            onChangeText={(taskTitle) => setTaskTitle(taskTitle)}
          />
          <Text>Tell us more about what are you looking for.</Text>

          <TextInput
            style={styles.taskDetails}
            placeholder="  taskDetails"
            placeholderTextColor={"#3c3744"}
            onChangeText={(taskDetails) => setTaskDetails(taskDetails)}
          />
          <View>
            <Text>Task speciality</Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data={specialities}
              save="value"
              label="Categories"
              boxStyles={{marginTop:25}}
            />
          </View>

          <View style={styles.PriceContainer}>
            <Text style={styles.price}>Price:</Text>
            <TextInput
              style={styles.priceTxt}
              placeholder="£"
              onChangeText={(price) => setPrice(price)}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonsView}
            onPress={() => pickImageAsync()}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonsView}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
          
          
        </View>
      </View>
    </ScrollView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
  },
  task: {
    flex: 15,
  },
  taskDetails: {
    backgroundColor: "white",
    paddingTop: 3,
    marginTop: 10,
    paddingBottom: 60,
    marginBottom: 2,
  },
  SelectList: {
    backgroundColor: "grey",
  },
  priceTxt: {
    marginTop: 10,
    backgroundColor: "white",
    fontSize: 15,
  },
  taskTitle: {
    fontSize: 20,
  },
  tasktitleBox: {
    backgroundColor: "white",
    fontSize: 10,
    marginTop: 10,
    paddingTop: 3,
    paddingBottom: 8,
    marginBottom: 2,
  },
  buttonsView: {
    width: "90%",
    color: "#000",
    height: 50,
    backgroundColor: "#c2d4f0",
    borderRadius: 10,
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
    padding: 10,
  },
});
