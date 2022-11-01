import React from "react";
import { View,StyleSheet,Text,Image } from "react-native";

const TaskTwo = () => {
    return(
        <View style={styles.container}>
            {/* image */}
            <Image source={{
                uri: "https://images.unsplash.com/photo-1635614986085-bf0d7a4ae4da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGxhd24lMjBtb3dpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60"
            }}
            style={styles.image}
            />
            <View style={{padding: 10}}>

            {/* title */}
            <Text style={styles.title}>Lawn mower</Text>

            {/* description*/}
            <Text style={styles.description}>I'm looking for someone to mow  my lawn as soon as possible.</Text>
       
            {/* amount */}
            <Text style={styles.amount}>£8.00/h </Text>
            </View>
        </View>
    )
}

export default TaskTwo;

const styles = StyleSheet.create({ 
    container:{
        width:"90%",
        alignSelf: "center",
        borderRadius: 40,
        backgroundColor: "#EDF6F9",
        marginTop: 20
    },
    image:{
        height:200,
        width: "100%",
        borderTopLeftRadius:40,
        borderTopRightRadius:40

    },
    title:{
        fontSize:18,
        fontWeight:"600",
        marginTop: 10
    },
    description:{
        fontSize:14,
        fontWeight:"400",
        marginTop: 10
    },
    amount:{
        fontSize:14,
        alignSelf: 'flex-end',
        fontWeight: "bold",
        color:"#0077B6",
        marginTop:10
    }
})