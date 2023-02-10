import React from "react";
import {View,TextInput,Text,StyleSheet} from "react-native";


const SearchBar = (props)=>{
    return(
        <View style={styles.container}>
            <TextInput
                placeholder="Search"
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
        paddingHorizontal: 100,
        borderRadius: 10,
        color: "#000",
        borderWidth: 1,
        flexGrow:4,
        marginHorizontal:2
    }
});