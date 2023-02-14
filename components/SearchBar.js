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
        backgroundColor: "#f1f3f3",
        paddingHorizontal: 20,
        borderRadius: 20,
        color: "#000",
        borderWidth: 2,
        marginHorizontal:20,
        height:40,
        alignItems:"flex-end",
        borderColor:"#f1f3f3"
    }
});