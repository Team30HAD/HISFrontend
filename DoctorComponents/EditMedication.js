import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSideBar';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../config';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

const validateInputs = (medication) => {
    if (!medication.medicineName.trim()) {
        Alert.alert('Medicine Name is required.');
        return false;
    }
    if (!isNaN(medication.medicineName)) {
        Alert.alert('Medicine Name should be a string and not just numeric.');
        return false;
    }

    const dosageRegex = /^\d+ mg$/;
    if (!medication.dosage.trim()) {
        Alert.alert('Dosage is required.');
        return false;
    }
    if (!dosageRegex.test(medication.dosage.trim())) {
        Alert.alert('Dosage should be in the format: [number] mg (e.g., 10 mg).');
        return false;
    }

    const frequencyRegex = /^\d+ times$/;
    if (!medication.frequency.trim()) {
        Alert.alert('Frequency is required.');
        return false;
    }
    if (!frequencyRegex.test(medication.frequency.trim())) {
        Alert.alert('Frequency should be in the format: [number] times (e.g., 3 times).');
        return false;
    }

    const durationRegex = /^\d+ (days|weeks|months|years)$/;
    if (!medication.duration.trim()) {
        Alert.alert('Duration is required.');
        return false;
    }
    if (!durationRegex.test(medication.duration.trim())) {
        Alert.alert('Duration should be in the format: [number] days/weeks/months/years (e.g., 10 days, 3 weeks, 1 month, 2 years).');
        return false;
    }

    if (medication.specialInstructions !== null && /^[0-9]+$/.test(medication.specialInstructions)) {
        Alert.alert('Special Instructions should be a string.');
        return false;
    }
    

    return true;
};

export default function EditMedication({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const patientId = route.params.patientId;
    const medicineId = route.params.medicationId;
    const [medication, setMedication] = useState({
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        specialInstructions: '',
    });

    useEffect(() => {
        fetchMedicationDetails();
    }, []);

    const fetchMedicationDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/getMedication/${patientId}/${medicineId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const fetchedMedication = response.data;
            setMedication({
                medicineName: fetchedMedication.medicineName,
                dosage: fetchedMedication.dosage,
                frequency: fetchedMedication.frequency,
                duration: fetchedMedication.duration,
                specialInstructions: fetchedMedication.specialInstructions,
            });
        } catch (error) {
            console.error('Error fetching medication details:', error);
        }
    };

    const handleChange = (key, value) => {
        setMedication({ ...medication, [key]: value });
    };

    const handleSubmit = async () => {
        try {
            if (!validateInputs(medication)) {
                return;
            }
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/doctor/editMedication/${patientId}/${medicineId}`, {
                ...medication
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
                Alert.alert("Medication Updated successfully");
                route.params.onView();
                navigation.goBack();
        } catch (error) {
            console.error('Error updating medication:', error);
        }
    };

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSidebar navigation={navigation} />}
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.formcontent}>
                    <Text style={styles.heading}>Edit Medication</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Medication Name:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleChange('medicineName', text)}
                            value={medication.medicineName}
                            placeholder="Medication Name"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Dosage:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleChange('dosage', text)}
                            value={medication.dosage}
                            placeholder="Dosage"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Frequency:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleChange('frequency', text)}
                            value={medication.frequency}
                            placeholder="Frequency"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Duration:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleChange('duration', text)}
                            value={medication.duration}
                            placeholder="Duration"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Special Instructions:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleChange('specialInstructions', text)}
                            value={medication.specialInstructions}
                            placeholder="Special Instructions"
                        />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
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
    },
    formContainer: {
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        width: 360,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        borderRadius: 5,
        width: 200,
        marginBottom: 20,
    },
    submitButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    formcontent: {
        alignItems: 'center'
    },
});
