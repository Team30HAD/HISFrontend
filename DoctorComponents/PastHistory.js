import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

export default function PastHistory({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [pastMedicalHistory, setPastMedicalHistory] = useState(null);
    const [medications, setMedications] = useState([]);
    const [tests, setTests] = useState([]);
    const patientId  = route.params.patientId;
    const patientDetails = route.params.patientDetails;

    const fetchPastHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/pastHistory/${patientId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPastMedicalHistory(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const fetchPastTests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/pastTests/${patientId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTests(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const fetchPastMedications = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/pastMedications/${patientId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMedications(response.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };

    useEffect(() => {
        fetchPastMedications();
        fetchPastTests();
        fetchPastHistory();
    }, [patientId]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleTestImages = (testId) => {
        navigation.navigate('TestImages', { testId });
    };

    const handlePastImages = (historyId) => {
        navigation.navigate('PastImages', { historyId });
    };

    const renderTable = () => {
        switch (selectedOption) {
            case 'PastMedicalHistory':
                return (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerText}>S.No</Text>
                            <Text style={styles.headerText}>Disease</Text>
                            <Text style={styles.headerText}>Medicine</Text>
                            <Text style={styles.headerText}>Dosage</Text>
                            <Text style={styles.headerText}>Remarks</Text>
                            <Text style={styles.headerText}>Recorded At</Text>
                            <Text style={styles.headerText}>Images</Text>
                        </View>
                        {pastMedicalHistory.map((history, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                                <Text style={styles.tableCell}>{history.disease}</Text>
                                <Text style={styles.tableCell}>{history.medicine}</Text>
                                <Text style={styles.tableCell}>{history.dosage}</Text>
                                <Text style={styles.tableCell}>{history.remarks}</Text>
                                <Text style={styles.tableCell}>{history.recordedAt}</Text><TouchableOpacity style={styles.tableCell} onPress={() => handlePastImages(history.historyId)}>
                                    <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>View Images</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                );
            case 'PastMedications':
                return (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerText}>S.No</Text>
                            <Text style={styles.headerText}>Disease</Text>
                            <Text style={styles.headerText}>Medication Name</Text>
                            <Text style={styles.headerText}>Dosage</Text>
                            <Text style={styles.headerText}>Frequency</Text>
                            <Text style={styles.headerText}>Duration</Text>
                            <Text style={styles.headerText}>Special Instructions</Text>
                            <Text style={styles.headerText}>Prescribed On</Text>
                        </View>
                        {medications.map((medication, index) => (
                            <View style={styles.tableRow} key={medication.medicineId}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                                <Text style={styles.tableCell}>{medication.visit.disease}</Text>
                                <Text style={styles.tableCell}>{medication.medicineName}</Text>
                                <Text style={styles.tableCell}>{medication.dosage}</Text>
                                <Text style={styles.tableCell}>{medication.frequency}</Text>
                                <Text style={styles.tableCell}>{medication.duration}</Text>
                                <Text style={styles.tableCell}>{medication.specialInstructions}</Text>
                                <Text style={styles.tableCell}>{medication.prescribedOn}</Text>
                            </View>
                        ))}
                    </View>
                );
            case 'PastTests':
                return (
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerText}>S.No</Text>
                            <Text style={styles.headerText}>Disease</Text>
                            <Text style={styles.headerText}>Test Name</Text>
                            <Text style={styles.headerText}>Prescribed On</Text>
                            <Text style={styles.headerText}>Test Result</Text>
                            <Text style={styles.headerText}>Test Images</Text>
                        </View>
                        {tests.map((test, index) => (
                            <View style={styles.tableRow} key={test.id}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                                <Text style={styles.tableCell}>{test.visit.disease}</Text>
                                <Text style={styles.tableCell}>{test.testName}</Text>
                                <Text style={styles.tableCell}>{test.prescribedOn}</Text>
                                <Text style={styles.tableCell}>{test.result}</Text>
                                <TouchableOpacity style={styles.tableCell} onPress={() => handleTestImages(test.id)}>
                                    <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>View Images</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
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
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.radioContainer}
                            onPress={() => handleOptionChange('PastMedicalHistory')}
                        >
                            <RadioButton
                                value="PastMedicalHistory"
                                status={selectedOption === 'PastMedicalHistory' ? 'checked' : 'unchecked'}
                                color="#007BFF"
                            />
                            <Text style={styles.radioLabel}>Past Medical History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioContainer}
                            onPress={() => handleOptionChange('PastMedications')}
                        >
                            <RadioButton
                                value="PastMedications"
                                status={selectedOption === 'PastMedications' ? 'checked' : 'unchecked'}
                                color="#007BFF"
                            />
                            <Text style={styles.radioLabel}>Past Medications</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioContainer}
                            onPress={() => handleOptionChange('PastTests')}
                        >
                            <RadioButton
                                value="PastTests"
                                status={selectedOption === 'PastTests' ? 'checked' : 'unchecked'}
                                color="#007BFF"
                            />
                            <Text style={styles.radioLabel}>Past Tests</Text>
                        </TouchableOpacity>
                    </View>
                    {renderTable()}
                    <TouchableOpacity
                        style={[styles.backButton, { width: 100, backgroundColor: 'green' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Back</Text>
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
    tableContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
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
    actionsContainer: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      radioLabel: {
        marginLeft: 10,
        color: '#007BFF',
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
    patientDetailsContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});
