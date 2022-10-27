import React, {useState} from 'react';
import {View, StyleSheet } from "react-native";
import { Input, Button } from 'react-native-elements';
import {auth} from '../firebase';

const RegisterScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [imageURL, setImageURL] = useState('');
    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                user.updateProfile({
                    displayName: name,
                    photoURL: imageURL? imageURL: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png"
                }).then(function () {

                }).catch(function (error){

                });
                navigation.popToTop();
            })
            .catch((error) => {
                var errorMessage = error.Message;
                alert(errorMessag);
            });
    }
    return (
        <View style={styles.container}>
            <Input
            placeholder="Enter your name"
            label="Name"
            leftIcon={{type: 'material', name: 'badge'}}
            value={name}
            onChangeText={text => setName(text)}
            /> 
            <Input
            placeholder="Enter your email"
            label="Email"
            leftIcon={{type: 'material', name: 'email'}}
            value={email}
            onChangeText={text => setEmail(text)}
            /> 
            <Input
            placeholder="Enter your password"
            label="password"
            leftIcon={{type: 'material', name: 'lock'}}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            />
            <Input
            placeholder="Enter your image URL"
            label="Profile Picture"
            leftIcon={{type: 'material', name: 'face'}}
            value={imageURL}
            onChangeText={text => setImageURL(text)}
            /> 
            <Button title="Register" style={StyleSheet.button} onPress={register}/>
        </View>
    );
}

export default RegisterScreen;

const styles = StyleSheet.create({
    button: {
        width: 200,
        margintop: 10 
    },
    container: { 
        flex: 1,
        alighItems:'centre',
        padding:10
    }
})