import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function CheckinForm({visible,onClose,getProg,location,myip,distance}){
    const [loading, setLoading] = React.useState(false);    

    const [formData, setFormData] = React.useState({
        name:"",
        index_no:"",
        programme:"",
        level:"",
        myip:myip,
        location:{
            lat: location?.latitude || null,
            lon: location?.longitude || null,
        }

    });


    const handleName = (name) => {
        setFormData((prev)=>({...prev,name}))
    };
    const handleIndex = (index_no) => {
        // const val = index_no.toUpperCase();
        setFormData((prev)=>({...prev,index_no:index_no.toUpperCase()}));
    };
    const handleProgramme = (programme) => {
        setFormData((prev)=>({...prev,programme:programme.toUpperCase()}));
        getProg(programme);
    };
    const handleLevel = (level) => {
        setFormData((prev)=>({...prev,level}))
    };

    const range = 0.026;
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


    const handleSubmit = async () =>{

        // Validate form fields
        if (!formData.name || !formData.programme || !formData.level) {
            alert("Please fill all required fields.");
            return;
        }

        if(formData.programme.length !== 5){
            alert("Invalid programme code");
            return;
        }

        setLoading(true); // Start loading


        if (distance === null) {
            alert("Host location not found 😬. Check course code or turn on location. Then refresh and try again.");
            setLoading(false); // Stop loading
            return;
        }
        else if( distance > range){
            alert(`You are out of range 😭.Refresh and try again`);
            setLoading(false); // Stop loading
            return;
        }

        try{
            const response = await fetch("https://attendict-apk.onrender.com/api/checkin-details",{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body:JSON.stringify(formData)
            })

            const data = await response.json();


            if (data.dbAvailable === false) {
            alert("Session doesn't exist");
            setLoading(false);
            onClose();
            return;
            }

            if (!data.success === false){
                alert("Invalid Index Number");
                setLoading(false);
                return;
            }


            if(data.alreadyCheckedIn){
            alert("You've already checkedin");
            setLoading(false); // Stop loading
            onClose();
            return;
            }



            console.log("Check-in successful:", data);
            alert(`Submitted Successfully🎉\nYou are ${distance.toFixed(3)}km away`);
            console.log(distance);
            setLoading(false); // Stop loading
            onClose(); // close the form so the countdown shows
            

        }
        catch(error){
            alert("No internet connection. Try again");
            console.log(error);
            setLoading(false)
            onClose();
        }


    }

    return(
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.hostContainer}>
                    <View style={styles.form}>
                        <Text style={styles.header}>Check-In</Text>
                        <Text style={styles.subheader}>(for class members)</Text>
                        
                        <Text>Full name</Text>
                        <TextInput
                        placeholder="Ex. Foster Ametepey"
                        placeholderTextColor = "#888"
                        value={formData.name}
                        onChangeText={handleName}
                        style={styles.input}
                        />

                        <Text>Index Number</Text>
                        <TextInput 
                        placeholder="SRI.41.XXX.XXX.XX"
                        placeholderTextColor = "#888"
                        style={styles.input}
                        value={formData.index_no.toUpperCase()}
                        onChangeText={handleIndex}
                        />

                        <Text>Programme & Course Initials</Text>
                        <TextInput
                        placeholder="CE123"
                        placeholderTextColor = "#888"
                        value={formData.programme}
                        onChangeText={handleProgramme}
                        style={styles.input}
                        />

                        <RNPickerSelect
                        onValueChange={handleLevel}
                        style={styles.input}
                        items={[
                            {label:"Level 100", value:"Level 100"},
                            {label:"Level 200", value:"Level 200"},
                            {label:"Level 300", value:"Level 300"},
                            {label:"Level 400", value:"Level 400"},
                        ]}

                        placeholder={{label:"Select level", value:null}}
                        value = {formData.level}
                        />

                        <TouchableOpacity 
                        style={styles.submitButton}  
                        onPress={()=>handleSubmit()}

                        >
                            {
                                loading ? (<ActivityIndicator color="white" 
                                    size={28}/>):
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
        backgroundColor: "rgba(0,0,0,0.4)", 
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
        borderColor: "rgba(132, 212, 156, 0.6)",
        color: "black",
    },
    submitButton:{
        alignItems: "center",
        backgroundColor: "rgba(36, 179, 79, 0.95)",
        width: 125,
        padding: 7,
        marginLeft:55,
        borderRadius:5,
    },
    submitText:{
        color: "white",
        fontSize: 20,
        
    }

})