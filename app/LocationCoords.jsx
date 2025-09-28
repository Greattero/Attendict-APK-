import * as Location from "expo-location";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";

export default function LocationCoords({locationValues}){
    const [coords, setCoords] = React.useState(null);
    const subscription = useRef(null);

    useEffect(()=>{
    const getLocation = async () => {
        try{
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted"){
            alert("Permission not granted");
            return;
        }

        subscription.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 3000,
                distanceInterval: 2,
            },

            (location)=>{
                setCoords(location.coords);
                locationValues(location.coords);
            }
        );

        
    }
    catch(erorr){
        console.log("Here run");
        getLocation();

    }

        
    };

    getLocation();

    return ()=>{
        if(subscription.current){
            subscription.current?.remove();
        }
    }

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