import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

export default function ViewMedications({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [medications, setMedications] = useState([]);
    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;
    const fetchMedications = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/viewMedications/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMedications(response.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    },[]);

    useEffect(() => {
        fetchMedications();
    }, [fetchMedications]);

    const handleEdit = (medicationId) => {
        navigation.navigate('EditMedication', { patientId, medicationId , onView: fetchMedications});
    };

    const handleAdd = () => {
        navigation.navigate('AddMedications', { patientId , onView: fetchMedications});
    };

    const handleDelete = async (medicationId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`http://172.16.145.54:8090/doctor/deleteMedication/${patientId}/${medicationId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchMedications();
        } catch (error) {
            console.error('Error deleting medication:', error);
        }
    };

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
                <View style={styles.content}>
                    {isSidebarOpen && <DoctorSideBar navigation={navigation}/>}
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
                    <Text style={styles.heading}>Medications</Text>
                    <TouchableOpacity
                        style={styles.addMedicationsButtonContainer}
                        onPress={handleAdd}
                    >
                        <Text style={styles.addMedicationsButtonText}>Add Medications</Text>
                    </TouchableOpacity>
    
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerText}>S.No</Text>
                            <Text style={styles.headerText}>Medication Name</Text>
                            <Text style={styles.headerText}>Dosage</Text>
                            <Text style={styles.headerText}>Frequency</Text>
                            <Text style={styles.headerText}>Duration</Text>
                            <Text style={styles.headerText}>Special Instructions</Text>
                            <Text style={styles.headerText}>Prescribed On</Text>
                            <Text style={styles.headerText}>Action</Text>
                        </View>
                        {medications.map((medication, index) => (
                            <View style={styles.tableRow} key={medication.medicineId}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                                <Text style={styles.tableCell}>{medication.medicineName}</Text>
                                <Text style={styles.tableCell}>{medication.dosage}</Text>
                                <Text style={styles.tableCell}>{medication.frequency}</Text>
                                <Text style={styles.tableCell}>{medication.duration}</Text>
                                <Text style={styles.tableCell}>{medication.specialInstructions}</Text>
                                <Text style={styles.tableCell}>{medication.prescribedOn}</Text>
                                <View style={styles.actionContainer}>
                                    <TouchableOpacity onPress={() => handleEdit(medication.medicineId)}>
                                        <MaterialIcons name="edit" size={24} color="blue" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(medication.medicineId)}>
                                        <MaterialIcons name="delete" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.footerContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('DoctorPatientDashboard', { patientId })}>
                            <Text style={styles.footerText1}>Back</Text>
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
    patientDetailsContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    addMedicationsButtonContainer: {
        backgroundColor: 'green',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'flex-end',
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    addMedicationsButtonText: {
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold', 
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    headerText: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 40,
    },
    footerText1: {
        textAlign: 'left',
        marginTop: 10,
        color: 'blue',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});