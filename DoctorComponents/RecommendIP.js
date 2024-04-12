import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecommendIP({ navigation, route }) {
    const spec = route.params.spec;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState(spec);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;

    useEffect(() => {
        fetchSpecializations();
    }, []);

    useEffect(() => {
        if (selectedSpecialization) {
            setSelectedDoctor(null);
            fetchDoctors();
        }
      }, [selectedSpecialization]);

    
      
    
    console.log("selectedDoctor:", selectedDoctor);

    const fetchSpecializations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/getAllSpecializations`,{
                headers: {
                        Authorization: `Bearer ${token}`
                    }
            });
            setSpecializations(response.data);
        } catch (error) {
            console.error('Error fetching specializations:', error);
        }
    };


    const fetchDoctors = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/getSpecializationDoctors/${selectedSpecialization}`,{
                headers: {
                        Authorization: `Bearer ${token}`
                    }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleSave = async () => {
        try {
            if (selectedDoctor) {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/doctor/changetoIP/${patientId}/${selectedDoctor}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (response.ok) {
                    Alert.alert("Changed to IP successfully");
                    navigation.navigate('DoctorPatientDetails',{shouldFetchData: true});
                } else {
                    console.error('Failed to change to IP:', response.status);
                    Alert.alert('Failed to change to IP. Please try again later.');
                }
            } else {
                console.log('No doctor selected'); 
                Alert.alert("Please select a doctor.");
            }
        } catch (error) {
            console.error('Error while changing to IP:', error);
            Alert.alert('An error occurred while changing to IP. Please try again later.');
        }
    };
    
    

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSideBar navigation={navigation} />}
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.patientDetailsContainer}>
                        <Text style={styles.heading}>Patient Details</Text>
                        {patientDetails && (
                            <View style={styles.detailsContainer}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Patient ID:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.patientId}</Text>
                                    <Text style={styles.detailLabel}>Name:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.patientName}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Age:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.age}</Text>
                                    <Text style={styles.detailLabel}>Sex:</Text>
                                    <Text style={styles.detailValue}>{patientDetails.sex}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.headerText}>Select Specialization:</Text>
                        <Picker
                            selectedValue={selectedSpecialization}
                            style={styles.dropdown}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedSpecialization(itemValue);
                            }}
                        >
                            {specializations.map((spec, index) => (
                                <Picker.Item key={index.toString()} label={spec} value={spec} />
                            ))}
                        </Picker>
                        <Text style={styles.headerText}>Select Doctor:</Text>
                        <Picker
                            selectedValue={selectedDoctor}
                            style={styles.dropdown}
                            onValueChange={(itemValue, itemIndex) => setSelectedDoctor(itemValue)}
                        >
                            <Picker.Item key="selectDoctor" label="Select Doctor" value={null} />

                            {doctors.map((doc, index) => (
                                <Picker.Item key={index} label={doc.name} value={doc.doctorId} />
                            ))}
                        </Picker>
                    </View>


                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backButton, { width: 100, backgroundColor: 'red' }]}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
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
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
    detailsContainer: {
        flex: 1,
        marginRight: 10,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      detailLabel: {
        fontWeight: 'bold',
        marginRight: 5,
        color: '#555',
      },
      detailValue: {
        flex: 1,
        color: '#333',
      },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    headerText: {
        fontWeight: 'bold',
    },
    patientDetailsContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    backButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 40,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 16,
      color: 'white',
    },
    dropdownContainer: {
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    
    saveButton: {
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
});
