import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import React, { Component } from "react";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
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

const Post = ({ navigation }) => {
  const [taskDetails, setTaskDetails] = useState('');
  const [selected, setSelected] = React.useState([]);
  const [price, setPrice] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [prefDate,setPrefDate] = useState(new Date);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [Specialities,setSpecialities] = React.useState([]);
  const data = [
    { key: "1", value: "Cleaning" },
    { key: "2", value: "Gardening" },
    { key: "3", value: "repairments" },
    { key: "4", value: "Craft" },
    { key: "5", value: "Chores" },
    { key: "6", value: "Beauty" },
  ];

  //try to fetch data from sql
//   React.useEffect(() => 
//   //Get Values from database
//   fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/Specialities.php', {
//             method: 'post',
//             header: {
//                 Accept: 'application/json',
//                 'Content-type': 'application/json',
//             },
//             body: JSON.stringify({
//                 specialityID: specialityID,
//                 speciality : speciality
//             }),
//         })
//     .then((response) => {
//       // Store Values in Temporary Array
//       let newArray = response.data.map((item) => {
//         return {key: item.specialityID, value: item.speciality}
//       })
//       //Set Data Variable
//       setData(newArray)
//     })
//     .catch((e) => {
//       console.log(e)
//     })
// ,[])

  handelSubmit = () => {
    if (price == 0) {
      alert("You have to set a price");
    }else if(taskTitle ==''){
      alert("YOu need to add a title");
    }else if(taskDetails == ''){
      alert("YOu need to add Job details");
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
            ID: global.userID
        }),
      })
        .then((response) => response.text())
        .then((responseJson) => {
          //console.log(responseJson);
          alert("job added Successfully");
          navigation.navigate("HomeScreen");
        })
        .catch((error) => {
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

//   const handleConfirm = (date) => {
//     let temp = date;
//     let fDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
//     //date = fDate;
//     setPrefDate(fDate);
//     hideDatePicker();
//   };

  return (
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
          <Text>task Speciality</Text>
          <SelectList
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
            //onSelect={() => alert(selected)}
            label="Categories"
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

        {/* <View style={styles.dateContainer}>
          <Text>This job should be done before:</Text>
          <Button title="Show Prefared date" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            //onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View> */}
        <TouchableOpacity
          style={styles.buttonsView}
          onPress={() => handelSubmit()}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
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
