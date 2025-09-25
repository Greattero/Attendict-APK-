import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function HostForm({visible, onClose, exportDuration,location,myip, proceedTimer}) {
    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name:"",
        index_no:"",
        programme:"",
        level:"",
        duration:null,
        myip:myip,
        location:{
            lat: location?.latitude || null,
            lon: location?.longitude || null,
        }        
    })

    const handleName = (name) => {
        setFormData((prev)=>({...prev,name}))
    };
    const handleIndex = (index_no) => {
        // const val = index_no.toUpperCase();
        setFormData((prev)=>({...prev,index_no:index_no.toUpperCase()}));
    };
    const handleProgramme = (programme) => {
        setFormData((prev)=>({...prev,programme:programme.toUpperCase()}));
    };
    const handleLevel = (level) => {
        setFormData((prev)=>({...prev,level}))
    };
    const handleDuration = (duration)=>{
        setFormData((prev)=>({...prev,duration}));
        exportDuration(duration)
    }

    React.useEffect(()=>{
        if(location){
        setFormData((prev)=>({...prev,
            location:{
                lat:location.latitude,
                lon:location.longitude,
            }
        }))}
    },[location]);

    React.useEffect(()=>{
        if(myip){
            setFormData((prev)=>({...prev, myip }))
        }
    },[myip])

    const handleSubmit = async () => {

        if (!formData.name || !formData.programme || !formData.level || !formData.duration) {
            alert("Please fill all required fields.");
            return;
        }

        if(formData.programme.length !== 5){
            alert("Invalid programme code");
            return
        }

        if(formData.location.lat === null || formData.location.lon === null){
        alert("Location not found 😬. Check if location is on and try again.");
        return;
        }

        setLoading(true); // Start loading

        console.log("Sending data:", formData);

        
        try{
            const response = await fetch("https://attendict-apk.onrender.com/api/host-details",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();
            console.log(`okacccyyyyy: ${data.success}`);
            
            if (data.success===false){
                alert("Invalid Index Number");
                setLoading(false);
                return;
            }

            if (data.dbAvailable) {
                alert("Session already exists.");
                setLoading(false);
                console.log(`Was it: ${data.dbAvailable}`);
                onClose();
                return;
            }


            console.log("Successfully submitted:", data);
            proceedTimer(true);
            alert("Submitted Successfully🎉");
            setLoading(false); // Stop loading
            onClose();

        }

        catch(error){
            console.error("Fetch error:", error);
            alert("Unstable connection. Try Again");
            setLoading(false);
            onClose();
        }
    }

    return(
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.hostContainer}>
                    <View style={styles.form}>
                        <Text style={styles.header}>HOST</Text>
                        <Text style={styles.subheader}>(for lecturers/course reps only)</Text>
                        <Text>Fullname</Text>
                        <TextInput 
                            placeholder="Ex. Jessica Mahunu"
                            value={formData.name}
                            onChangeText={handleName}
                            style={styles.input}
                        />

                        <Text>Index Number</Text>
                        <TextInput
                        style={styles.input}
                        value={formData.index_no}
                        onChangeText={handleIndex}
                        />

                        <Text>Programme Initials & Course Code</Text>
                        <TextInput
                            placeholder="Ex. CE123"
                            value = {formData.programme}
                            onChangeText={handleProgramme}
                            style={styles.input}
                        />
                        
                        <RNPickerSelect
                        onValueChange={handleLevel}
                        items={[
                            {label: "Level 100", value: "Level 100"},
                            {label: "Level 200", value: "Level 200"},
                            {label: "Level 300", value: "Level 300"},
                            {label: "Level 400", value: "Level 400"},
                        ]}
                        
                        placeholder={{label: "Select Level", value: null}}
                        value={formData.level}
                        />

                        <RNPickerSelect
                        onValueChange={handleDuration}
                        style={styles.input}
                        items={[
                            {label:"5 mins", value: 5},
                            {label:"10 mins", value: 10}
                        ]}
                        placeholder={{label: "Select duration", value:null}}
                        value={formData.duration}

                        />

                        <TouchableOpacity 
                        style={styles.submitButton}  
                        onPress={()=>handleSubmit()}

                        >
                            {
                                loading ? (
                                <View>
                                    <ActivityIndicator color="white"  size={28}/>  
                                </View>
                                ):
                                (<Text style={styles.submitText}>Submit</Text>)
                            }
                        </TouchableOpacity>
                    
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )

}

const styles = StyleSheet.create({
    hostContainer:{
        flex: 1,
        justifyContent:"center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.43)",
    },
    form:{
        backgroundColor:"white",
        borderRadius: 15,
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 20,
        width:320,

    },
    header:{
        textAlign:"center",
        fontSize:30,
        color: "green",
        fontWeight:"bold",
        paddingBottom: 1,
        marginTop: -35,
    },
    subheader:{
        textAlign: "center",
        color: "grey",
        fontStyle: "italic",
        paddingBottom: 20,
    },
    input:{
        borderWidth:2,
        borderRadius:5,
        borderColor: "rgba(132, 212, 156, 0.6)"
    },
    submitButton:{
        alignItems: "center",
        backgroundColor: "rgba(36, 179, 79, 0.95)",
        width: 125,
        padding: 7,
        marginLeft:58,
        borderRadius:5,
    },
    submitText:{
        color: "white",
        fontSize: 20,
        
    }

})
