import React from "react";
import {View, StyleSheet, Text, Dimensions} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


export default function Header(){

    return(
        <View style={styles.heading}>
            <Text style={styles.text}>Attendict</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    heading:{
    backgroundColor: "white",
    width: screenWidth,
    height: screenHeight * 0.12,
    elevation: 6
    },

    text:{

        fontSize: 25,
        marginTop: 47,
        marginLeft: 10,

    }

})