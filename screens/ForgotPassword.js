import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = () => {
    if (email == "") {
      setMessage("Please enter your email address.");
      return;
    } else if (password == "" || password.length < 8) {
      setMessage("Please enter valid new password");
    }

    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/forgotPassword.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson == "success") {
          alert("Password updates successfully");
          navigation.navigate("Login")
        } else if (responseJson == "fail") {
          alert("update wasnt successful")
        } else if (responseJson == "email doesn't exist") {
          alert("email doesn't exist")
        }
      })
      .catch((error) => {
        alert(error);
      });

    setMessage(`Password reset email has been sent to ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address to reset your password.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  input: {
    height: 40,
  },
  message: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1A1918",
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default ForgotPassword;
