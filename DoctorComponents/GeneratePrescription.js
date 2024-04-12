import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

export default function GeneratePrescription({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [medications, setMedications] = useState([]);
    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;
    const vitals = route.params.vitals;
    const symptoms = route.params.symptoms;
    const disease = route.params.disease;
    const [tests, setTests] = useState([]);
    

    const fetchTests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/viewTests/${patientId}`,{
            headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTests(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };


    const fetchMedications = async () => {
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
    };


    useEffect(() => {
        fetchTests();
        fetchMedications();
    }, []);

    
    return (
        <View style={styles.container}>
          <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
          <View style={styles.flexContainer}>
            {isSidebarOpen && <DoctorSideBar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
            <View style={{ flex: 1, flexDirection: "column" }}>
                <Text style={styles.heading}>Patient Details</Text>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Department:</Text>
                    <Text style={styles.detailValue}>{patientDetails.department}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Patient ID:</Text>
                    <Text style={styles.detailValue}>{patientDetails.patientId}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{patientDetails.patientName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sex:</Text>
                    <Text style={styles.detailValue}>{patientDetails.sex}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Age:</Text>
                    <Text style={styles.detailValue}>{patientDetails.age} years</Text>
                  </View>
                  {patientDetails.department === 'IP' && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Bed ID:</Text>
                      <Text style={styles.detailValue}>{patientDetails.bed.bId}</Text>
                    </View>
                  )}
                </View>
      
                <View style={styles.horizontalGap} />
      
                <View style={styles.vitalsContainer}>
                  <Text style={styles.sectionHeader}>Vitals</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Temperature:</Text>
                    <Text style={styles.detailValue}>{vitals.temperature}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pulse:</Text>
                    <Text style={styles.detailValue}>{vitals.pulse}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Blood Pressure:</Text>
                    <Text style={styles.detailValue}>{vitals.bp}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Oxygen:</Text>
                    <Text style={styles.detailValue}>{vitals.spo2}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Weight:</Text>
                    <Text style={styles.detailValue}>{vitals.weight}</Text>
                  </View>
                </View>
      
                <View style={styles.horizontalGap} />
      
                <View style={styles.symptomsContainer}>
                  <Text style={styles.sectionHeader}>Symptoms</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>1.</Text>
                    <Text style={styles.detailValue}>{symptoms.symptom1}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>2.</Text>
                    <Text style={styles.detailValue}>{symptoms.symptom2}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>3.</Text>
                    <Text style={styles.detailValue}>{symptoms.symptom3}</Text>
                  </View>
                  {symptoms.symptom4 !== null && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>4.</Text>
                      <Text style={styles.detailValue}>{symptoms.symptom4}</Text>
                    </View>
                  )}
                  {symptoms.symptom5 !== null && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>5.</Text>
                      <Text style={styles.detailValue}>{symptoms.symptom5}</Text>
                    </View>
                  )}
                </View>
                <Text>    
                  <Text style={styles.Text}>Disease:</Text> {disease}
                </Text>
              </View>
      
              <Text style={styles.heading}>Medications</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>S.No</Text>
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
                    <Text style={styles.tableCell}>{medication.medicineName}</Text>
                    <Text style={styles.tableCell}>{medication.dosage}</Text>
                    <Text style={styles.tableCell}>{medication.frequency}</Text>
                    <Text style={styles.tableCell}>{medication.duration}</Text>
                    <Text style={styles.tableCell}>{medication.specialInstructions}</Text>
                    <Text style={styles.tableCell}>{medication.prescribedOn}</Text>
                  </View>
                ))}
              </View>
      
              <View style={styles.verticalGap} />
      
              <Text style={styles.heading}>Tests</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>S.No</Text>
                  <Text style={styles.headerText}>Test Name</Text>
                  <Text style={styles.headerText}>Prescribed On</Text>
                  <Text style={styles.headerText}>Test Result</Text>
                </View>
                {tests.map((test, index) => (
                  <View style={styles.tableRow} key={test.id}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{test.testName}</Text>
                    <Text style={styles.tableCell}>{test.prescribedOn}</Text>
                    <Text style={styles.tableCell}>{test.result}</Text>
                  </View>
                ))}
              </View>
      
              <TouchableOpacity
                style={[styles.backButton, { width: 100, backgroundColor: 'green' }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
}      

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
        paddingTop: 20,
      },
      flexContainer: {
        flex: 1,
        flexDirection: 'row',
      },
      header: {
        alignItems: 'center',
        marginBottom: 20,
      },
      headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        alignItems: 'center',
      },
      detailsContainer: {
        flex: 1,
        marginRight: 10,
      },
      vitalsContainer: {
        flex: 1,
        marginRight: 10,
      },
      symptomsContainer: {
        flex: 1,
      },
      horizontalGap: {
        marginHorizontal: 20,
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
    verticalGap: {
        marginVertical: 20,
    },
    patientDetailsContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
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
});
