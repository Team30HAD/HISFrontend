import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';
import { API_BASE_URL } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import BG_PastHistory from "../Nurse_Comp_Images/BG_PastHistory.png";

export default function EditPastHistory({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [pastHistory, setPastHistory] = useState({
        disease: '',
        dosage: '',
        medicine: '',
        recordedAt: new Date(), // initialize with current date
        remarks: '',
    });
    
    const patientId = route.params.patientId;
    const [showCalendar, setShowCalendar] = useState(false);
    console.log(patientId);
    const historyId=route.params.historyId;
    console.log(historyId);

    useEffect(() => {
        fetchOldPastHistory();
    }, []);

    const fetchOldPastHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/nurse/viewPastHistoryById/${patientId}/${historyId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const oldpastHistory = response.data;
            console.log(oldpastHistory);
            // Ensure recordedAt is converted to Date object
            oldpastHistory.recordedAt = new Date(oldpastHistory.selectedDate.getFullYear(), oldpastHistory.selectedDate.getMonth(), oldpastHistory.selectedDate.getDate());
            setPastHistory(oldpastHistory);
        } catch (error) {
            console.error('Error fetching old past history:', error);
        }
    };
    
    

    const handleDateChange = (event, selectedDate) => {
        console.log("Date changed:", selectedDate); // Check if the function is being triggered
        setShowCalendar(false); // Hide the calendar after selecting a date
        if (selectedDate) {
            console.log(selectedDate);
            setPastHistory({ ...pastHistory, recordedAt: selectedDate });
        }
    };


    const handleChange = (key, value) => {
        setPastHistory({ ...pastHistory, [key]: value });
    };

    const SemicircleBackground = ({ children, style }) => {
        return (
            <View style={[styles.background, style]}>
                {children}
            </View>
        );
    };

    const handleSubmit = async () => {
        try {
            if (!validateInputs()) {
                return;
            }

            
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/nurse/editPastHistory/${historyId}`, {
                ...pastHistory,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            console.log('Past history edited successfully:', response.data);
            Alert.alert("Past History Edited successfully");
            setPastHistory({
                disease: '',
                dosage: '',
                medicine: '',
                recordedAt: new Date(),
                remarks: '',
            });
        } catch (error) {
            console.error('Error editing past history:', error);
        }
    };

    const validateInputs = () => {
        const textRegex = /^[0-9a-zA-Z\s]+$/; 
        const recordedAtRegex = /^\d{4}-\d{2}-\d{2}$/; 
    
        if (pastHistory.disease.trim() && !textRegex.test(pastHistory.disease.trim())) {
            showAlert('Invalid input', 'Please enter a valid disease name');
            return false;
        }
    
        if (pastHistory.dosage.trim() && !textRegex.test(pastHistory.dosage.trim())) {
            showAlert('Invalid input', 'Please enter a valid dosage');
            return false;
        }
    
        if (pastHistory.medicine.trim() && !textRegex.test(pastHistory.medicine.trim())) {
            showAlert('Invalid input', 'Please enter a valid medicine name');
            return false;
        }
    
        if (pastHistory.remarks.trim() && !textRegex.test(pastHistory.remarks.trim())) {
            showAlert('Invalid input', 'Please enter valid remarks');
            return false;
        }
    
    
        return true;
    };
    
    const showAlert = (title, message) => {
        Alert.alert(title, message, [{ text: 'OK' }]);
    };
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    

    return (
        <View style={styles.container}>
            <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <ImageBackground source={BG_PastHistory} style={styles.content}>
                {isSidebarOpen && <NurseSidebar navigation={navigation} email={email} activeRoute="NursePatient_Details" />}
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <View style={styles.formcontent}>
                        <Text style={styles.heading}>Patient's Health Journey: Edit Past Medical History</Text>
                        <View style={styles.inputRow}>
                            <View style={styles.inputColumn}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Disease:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleChange('disease', text)}
                                        value={pastHistory.disease}
                                        placeholder="Disease"
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Medicine:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleChange('medicine', text)}
                                        value={pastHistory.medicine}
                                        placeholder="Medicine"
                                    />
                                </View>
                            </View>
                            <View style={styles.inputColumn}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Dosage:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleChange('dosage', text)}
                                        value={pastHistory.dosage}
                                        placeholder="Dosage"
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                <Text style={styles.label}>Recorded At:</Text>
                                <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
                                        <Text>{pastHistory.recordedAt.toString()}</Text>
                                        <FontAwesome name="calendar" size={24} color="black" />
                                    </TouchableOpacity>
                                    {showCalendar && (
                                        <DateTimePicker
                                            value={pastHistory.recordedAt}
                                            mode="date"
                                            display="default"
                                            maximumDate={new Date()} // Disable future dates
                                            onChange={(event, selectedDate) => handleDateChange(event, selectedDate)} // Ensure correct event handling
                                        />
                                    )}
                        </View>



                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Remarks:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleChange('remarks', text)}
                                value={pastHistory.remarks}
                                placeholder="Remarks"
                                multiline={true} // Enable multiline
                                numberOfLines={4}
                            />
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footerContainer}>
    {/* Back button */}
    <SemicircleBackground style={styles.lbackground}>
  <TouchableOpacity onPress={() => navigation.navigate('NursePatient_Dashboard', { patientId })} style={styles.footerItem}>
    <View style={styles.lfooterIconContainer}>
      <FontAwesome name="arrow-left" size={24} color="teal" />
    </View>
    <Text style={styles.footerText1}>Back</Text>
  </TouchableOpacity>
</SemicircleBackground>

{/* View button */}
<SemicircleBackground style={styles.rbackground}>
  <TouchableOpacity onPress={() => navigation.navigate('viewPastHistory', { patientId })} style={styles.footerItem}>
    <View style={styles.rfooterIconContainer}>
      <FontAwesome name="eye" size={24} color="teal" />
    </View>
    <Text style={styles.footerText2}>View</Text>
  </TouchableOpacity>
</SemicircleBackground>

</View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        //alignItems: 'center',
    },
    formContainer: {
        padding: 20,
        marginHorizontal: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: -10,
        marginBottom: 20,
        textAlign: 'center',
        color: 'teal',
        padding: 20,
    },
    inputContainer: {
        marginBottom: 40,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'teal',
        backgroundColor: 'lightgoldenrodyellow',
        paddingHorizontal: 10,
        height: 50,
        width: 400,
    },
    submitButton: {
        backgroundColor: 'teal',
        paddingVertical: 15,
        borderRadius: 5,
        width: 200,
        marginBottom: 50,
        // marginTop: 10,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    formcontent:{
        alignItems:'center'
    },
    footerText1: {
        textAlign: 'left',
        marginTop: 10,
        color: 'teal',
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footerText2: {
        textAlign: 'right',
        marginTop: 10,
        color: 'teal',
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inputColumn: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 25,
        marginRight: 10,
    },
    italicText: {
        fontStyle: 'italic',
    },
    redStar: {
        color: 'red',
    } ,
    lfooterIconContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginRight: 5, // Adjust this margin as needed
    }, 
    rfooterIconContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: 5, // Adjust this margin as needed
    },
    lbackground: {
        backgroundColor: 'cornsilk',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 500,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 0,
      },
      rbackground: {
        backgroundColor: 'cornsilk',
        borderTopLeftRadius: 500,
        borderTopRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 0,
      },   
});