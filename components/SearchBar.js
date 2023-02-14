import React from "react";
import {View,TextInput,Text,StyleSheet} from "react-native";


const SearchBar = (props)=>{
    return(
        <View style={styles.container}>
            <TextInput
                placeholder="what are you looking for ?"
                style={styles.input}
                value={props.searchText}
                onChangeText={(text)=>props.setSearchText(text)}
            />
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container:{
        margin: "auto",
        
        

    },
    input:{
        backgroundColor: "#EBEBEB",
        paddingHorizontal: 30,
        borderRadius: 15,
        color: "#000",
        borderWidth: 1,
        marginHorizontal:15,
        height:40,
        alignItems:"flex-end",
        borderColor:"#EBEBEB"
    }
});