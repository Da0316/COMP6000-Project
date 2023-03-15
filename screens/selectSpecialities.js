import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import { Card, Checkbox } from "react-native-paper";

export default SelectSpecialities = ({ route, navigation }) => {
  const [options, setOptions] = useState([]);
  const { userID } = route.params;
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
        for (let i = 0; i < responseJson.length / 2; i++) {
          let object = {
            id: Number(responseJson[counter]),
            speciality: responseJson[counter + 1],
            checked: false,
          };
          newOptions.push(object);
          counter = counter + 2;
        }
        setOptions(newOptions);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const handleChange = (id) => {
    const temp = options.map((option) => {
      if (id === option.id) {
        return { ...option, checked: !option.checked };
      }
      return option;
    });
    setOptions(temp);
  };

  let selected = options.filter((option) => option.checked);

  const renderList = (renderData) => {
    return (
      <FlatList
        data={renderData}
        renderItem={({ item }) => (
          <Card style={{ margin: 5, backgroundColor: "#fff" }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Checkbox
                  status={item.checked ? "checked" : "unchecked"}
                  onPress={() => {
                    handleChange(item.id);
                  }}
                />
                <Text>{item.speciality}</Text>
              </View>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  };

  const handleSubmit = () => {
    let idArray = [];
    selected.forEach(function (arrayItem) {
      idArray.push(arrayItem.id);
    });
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/insertSpecialities.php",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: userID,
          array: idArray,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == 1) {
          alert("Successfully inputted Specialities");
          setTimeout(function () {
            navigation.navigate("Login");
          }, 3000);
        } else if (responseJson == -1) {
          alert("Error has occurred");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <View
        testID="alloptionsList"
        style={{ flex: 4, backgroundColor: "#f9ce40" }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            paddingVertical: 6,
            marginHorizontal: 7,
            borderRadius: 20,
          }}
        >
          Select your specialities from the list below:
        </Text>
        {renderList(options)}
      </View>
      <Text style={styles.text}>Selected:</Text>
      <View style={{ flex: 2, backgroundColor: "#f9ce40", marginBottom: 5 }}>
        {renderList(selected)}
      </View>
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity
          testID="submitButton"
          style={styles.buttonsView}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#f9ce40",
    padding: 8,
  },

  card: {
    padding: 10,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
    marginHorizontal: 7,
  },
  buttonsView: {
    width: "100%",
    color: "#000",
    height: 50,
    backgroundColor: "black",
    borderRadius: 10,
    marginVertical: 10,
    display: "flex",
    justifyContent: "center",
    marginBottom: -10,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },
});
