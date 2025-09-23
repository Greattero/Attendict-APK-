import React, { useEffect } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";

export default function Countdown({ start }){

    const [seconds, setSeconds] = React.useState(start*60);

    useEffect(() => {
        if (seconds == 0) return;

        const timer = setInterval(()=> {
            setSeconds((prev) => prev - 1)
        },1000);

        return ()=>clearInterval(timer);

    },[seconds]);

    const formatTime = (time)=>{
        const m = Math.floor(time/60);
        const s = time % 60;
        return `${m} : ${s < 10 ? "0" + s : s}`;
    }


    return(
        <View>

            <Text style={styles.timer}>{formatTime(seconds)}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    timer:{
        fontSize:25,
        fontFamily: 'Roboto Mono',
    }
})