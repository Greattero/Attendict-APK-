import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion,Polyline } from 'react-native-maps';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from 'expo-router';
import { ref, onValue } from "firebase/database";
import { db } from "./firebaseConfig"; // adjust path

export default function App({userPos}) {
  const [busPos, setBusPos] = React.useState({});
  
  const mapRef = React.useRef(null);
  const navigation = useNavigation();


  // Animated region for driver marker
  const [driverLocation] = React.useState(
    new AnimatedRegion({
      latitude: 5.6037,   // default location (Accra example)
      longitude: -0.1870,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  );

  // Add "Locate Driver" button in header
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap} style={{ marginRight: 10 }}>
          <Text style={{ color: 'blue' }}>Locate Driver</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Listen for bus location updates from Firebase
  React.useEffect(() => {
    const busRef = ref(db, "buses/bus1");
    const unsub = onValue(busRef, (snapshot) => {
      if (snapshot.exists()) {
        const pos = snapshot.val();
        setBusPos(pos);

        driverLocation.timing({
          latitude: pos.lat,
          longitude: pos.lon,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    });

    return () => unsub();
  }, []);

  // Fallback initial region (so map doesn’t crash on first render)
  const INITIAL_REGION = {
    latitude: busPos.lat || 5.6037,
    longitude: busPos.lon || -0.1870,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Focus map on current bus location
  const focusMap = () => {
    if (busPos.lat && busPos.lon) {
      mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
    }
  };

  return (

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
      >
        <Marker.Animated coordinate={driverLocation} title="Bus" />

      {/* Draw line from YOU to BUS */}
      {userPos && busPos.lat && busPos.lon && (
        <Polyline
          coordinates={[
            userPos,
            { latitude: busPos.lat, longitude: busPos.lon }
          ]}
          strokeColor="blue"
          strokeWidth={3}
        />
      )}
      </MapView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: "100%",
  },
});
