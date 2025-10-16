import React from "react";
import { Alert, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";

const naviWidth = Dimensions.get("window").width;
const naviHeight = Dimensions.get("window").height;


export default function NavigationBar({switchToHome}){
    const [busButtonSwitch, setBusButtonSwitch] = React.useState(false);
    const [homeButtonSwitch, setHomeButtonSwitch] = React.useState(false);


    return(
        <View style={styles.container}>
            <TouchableOpacity 
            style={styles.buttonHome}
            onPress={()=>{setHomeButtonSwitch(true);
                setBusButtonSwitch(false);
                switchToHome(true);
                
            }
            }
            >
                {homeButtonSwitch? <Image source={require("../assets/images/home_selected.png")} style={styles.image}/> :
                <Image source={require("../assets/images/home.png")} style={styles.image}/>
                }
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonBus}
            onPress={()=>{setBusButtonSwitch(true);
                setHomeButtonSwitch(false);
                switchToHome(false);
            }
            }
            >
                {busButtonSwitch?<Image source={require("../assets/images/bus_selected.png")} style={styles.image}/>:
                <Image source={require("../assets/images/bus.png")} style={styles.image}/>
                }
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        position: "absolute",
        backgroundColor:"white",
        borderRadius: 0,
        width: naviWidth,
        height: naviHeight*0.08,
        padding:10,
        justifyContent: "center",
        alignItems: "center",
        bottom:0,
        left:0,
        right:0,
        flexDirection: "row", 
        elevation:15,       
    },
    buttonHome:{
        right:80,

    },
    buttonBus:{
        left:75,

    },
    image:{
        width:36,
        height:30,
    }
})