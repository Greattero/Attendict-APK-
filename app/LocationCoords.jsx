import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";

export default function LocationCoords(){
    const [coords, setCoords] = React.useState(null);

    useEffect(()=>{
    const getLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted"){
            alert("Permission not granted");
            return;
        }

        let location = Location.getCurrentPositionAsync();
        setCoords((await location).coords);
    };

    getLocation();
    },[])
 
    
    
    return(
        <View>
        {coords ? (
            <Text>
                Lat: {coords.latitude}{"\n"}
                Lon: {coords.longitude}
            </Text>
        ) :
        (<Text>
            Still fetching location....
        </Text>)
        }
        </View>
    )
}