import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";

function CreateApplication({ route, navigation }) {
  const { jobID } = route.params;
  const [applicationDate, setApplicationDate] = useState(new Date());
  const [priceOffer, setPriceOffer] = useState("");

  const checkOutstandingJob = () => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/checkOutstandingJob.php",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          jobID: jobID,
          applyingID: global.userID,
        }),
      }
    )
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson == "true") {
          alert("You have an outstanding job with this user");
        } else if (responseJson == "false") {
          submit();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const submit = () => {
    if (priceOffer != "") {
      fetch(
        "https://raptor.kent.ac.uk/proj/comp6000/project/08/createApplication.php",
        {
          method: "post",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            jobID: jobID,
            userID: global.userID,
            application_date: applicationDate,
            price_offer: priceOffer,
          }),
        }
      )
        .then((response) => response.text())
        .then((responseJson) => {
          alert("Application Sent!");
          navigation.navigate("HomeScreen");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      Alert("Please enter a price offer");
    }
  };
  return (
    <View style={styles.mainView}>
      <Text style={styles.heading}>Create Application</Text>
      <SafeAreaView style={styles.formView}>
        <TextInput
          testID="price_input"
          placeholder={"Price Offer*"}
          placeholderTextColor="#fff"
          onChangeText={(price_offer) => setPriceOffer(price_offer)}
          style={styles.TextInput}
        />
        <TouchableOpacity
          style={styles.buttonsView}
          onPress={() => checkOutstandingJob()}
          testID="apply_button"
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

export default CreateApplication;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9CE40",
  },

  TopView: {
    width: "100%",
    height: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomView: {
    width: "100%",
    height: "80%",
    backgroundColor: "purple",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 50,
  },

  formView: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 40,
  },

  TextInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#fff",
    height: 50,
    borderRadius: 10,
    paddingLeft: 5,
    marginTop: 20,
    color: "#fff",
  },

  buttonsView: {
    width: "90%",
    color: "#000",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
