import * as Location from "expo-location";
import { ref, set } from "firebase/database";
import { useEffect } from "react";
import { db } from "./firebaseConfig";


export default function FamekoDriver({busId}){

    useEffect(()=>{
        const startTracking = async ()=>{

            let {status} = await Location.requestForegroundPermissionsAsync;
            if(status !== granted) return;

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 2,
                },
                (loc) => {
                    const {longitude, latitude} = loc.coords;
                    set(ref(db,"/buses"+busId),{
                        lat: latitude,
                        lon: longitude,
                        ts: Date.now,
                    }
                )

                }
            )

        };

        startTracking();
        
    },[busId])





    return null
}