import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function HostForm({visible, onClose, setDuration}) {
    const [loading, setLoading] = React.useState(false);
    const [startClock, setStartClock] = React.useState(false);

    const [name, setName] = React.useState("");
    const [index, setIndex] = React.useState("");
    const [programme, setProgramme] = React.useState("");
    const [level, setLevel] = React.useState("");

    const handleName = () => {
        setName(name)
    };
    const handleIndex = () => {
        setIndex(index)
    };
    const handleProgramme = () => {
        setProgramme(programme)
    };
    const handleLevel = () => {
        setLevel(level)
    };
    const handleDuration = (duration) => {
        setDuration(duration)
    };

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
                            value={name}
                            onChangeText={handleName}
                            style={styles.input}
                        />

                        <Text>Index Number</Text>
                        <TextInput
                        style={styles.input}
                        />

                        <Text>Programme Initials & Course Code</Text>
                        <TextInput
                            placeholder="Ex. CE123"
                            value = {programme}
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
                        />

                        <RNPickerSelect
                        onValueChange={(value)=>setDuration(value)}
                        style={styles.input}
                        items={[
                            {label:"5 mins", value: 5},
                            {label:"10 mins", value: 10}
                        ]}
                        placeholder={{label: "Select duration", value:null}}

                        />

                        <TouchableOpacity 
                        style={styles.submitButton}  
                        onPress={()=>setLoading(true)}

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
