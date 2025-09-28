import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HostForm from "./HostForm.jsx";
import CheckinForm from "./CheckinForm.jsx";
import Countdown from "./Countdown.jsx";
import LocationCoords from "./LocationCoords.jsx";
import IPChecker from "./IPChecker.jsx";
import Header from "./Header.jsx";
import FetchHostCoords from "./FetchHostCoords.jsx";
import Distance from "./Distance.jsx"
import CollectNames from "./CollectNames.jsx";
import React from "react";

export default function App() {

  const [showHostForm, setShowHostForm] = React.useState(false);
  const [showCheckinForm, setShowCheckinForm] = React.useState(false);
  const [duration, setDuration] = React.useState();
  const [location,setLocation] = React.useState({});
  const [ip,setIp] = React.useState("");
  const [pollHostCoords,setPollHostCoords] = React.useState({});
  const [calDistance,setCalDistance] = React.useState();
  const [checkinProg, setCheckinProg] = React.useState();
  const [hostProg, setHostProg] = React.useState();
  const [startClock, setStartClock] = React.useState(false);
  const [collect, setCollect] = React.useState(false);



  return (
    <View style={styles.container}>
     {<Header/>}

    {startClock ? 
     <CollectNames
     timeUp = {false}
     programmeName = {hostProg}
     /> : <CollectNames
     timeUp={collect}
     programmeName = {hostProg}

     />}

     <LocationCoords
     locationValues={setLocation}
     />

     <IPChecker onIP={setIp}/>

    <FetchHostCoords
    setHostCoords={setPollHostCoords}
    checkinProgValue={checkinProg}
    />

    <Distance
    hostLat={pollHostCoords.lat}
    hostLon={pollHostCoords.lon}
    checkinLat={location.latitude}
    checkinLon={location.longitude}
    setDistance={setCalDistance}
    />

      <TouchableOpacity
        style={styles.button1}
        onPress={() => setShowHostForm(true)}
      >
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/admin.png")} style={styles.image}/>
        </View>
        <Text style={styles.buttonText}>Host</Text>

      </TouchableOpacity>

        <HostForm 
        visible={showHostForm}
        onClose={()=>setShowHostForm(false)}
        exportDuration={setDuration}
        location={location}
        myip={ip}
        proceedTimer={setStartClock}
        getProg={setHostProg}
        />

      <TouchableOpacity
        style={styles.button2}
        onPress={() => setShowCheckinForm(true)}
      >
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/checkin.png")} style={styles.image}/>
        </View>
        <Text style={styles.buttonText}>Checkin</Text>

      </TouchableOpacity>

      <CheckinForm
      visible={showCheckinForm}
      onClose={()=>setShowCheckinForm(false)}
      myip={ip}
      location={location}
      distance={calDistance}
      getProg={setCheckinProg}
      />

     <Text style={styles.timer} > 
      {startClock ? duration && <Countdown start={duration} enableStopClock={setStartClock} sendCollectSignal={setCollect}/> : null}
  
      </Text>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  button1: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 25,
    width: 320,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  button2: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: 320,
    height: 180,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",

  },
  buttonText: {
    color: "green",
    fontSize: 30,
    fontWeight: "bold",
  },
  imageContainer:{
    borderRadius: 500,
    padding: 7, 
    backgroundColor:"rgba(241, 241, 241, 1)",

  },
  image:{
    height: 50,
    width: 50,
    tintColor: "rgba(138, 134, 134, 1)",
  },
  timer:{
    position:"absolute",
    top: 50,
    right: 60,
  }
});
