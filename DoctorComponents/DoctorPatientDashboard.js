import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';

const DoctorPatientDashboard = ({ route, navigation }) => {
  const { patientId } = route.params;
  const { email } = useEmail();
  const [patientDetails, setPatientDetails] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [symptoms, setSymptoms] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [disease, setDisease] = useState(null);
  const [newDisease, setNewDisease] = useState('');

  const fetchDoctorDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/home/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const fetchedDoctorDetails = await response.json();
      setDoctorDetails(fetchedDoctorDetails);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const fetchPatientDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/patientDetails/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPatientDetails(data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const fetchVitals = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/patientVitals/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVitals(data);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    }
  };

  const fetchSymptoms = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/patientSymptoms/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSymptoms(data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };
  
  const fetchDisease = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/getDisease/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.text();
      setDisease(data);
    } catch (error) {
      console.error('Error fetching disease:', error);
    }
  };

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { shouldFetchData: shouldFetchDataParam } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      if (shouldFetchData || shouldFetchDataParam) {
        fetchDoctorDetails();
        fetchPatientDetails();
        fetchVitals();
        fetchSymptoms();
        fetchDisease();
        setShouldFetchData(false);
      }
    }, [shouldFetchData, shouldFetchDataParam])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShouldFetchData(true);
    });

    return unsubscribe;
  }, [navigation]);

  if (!patientDetails || !vitals || !symptoms) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleAddDisease = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/setDisease/${patientId}/${newDisease}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData && responseData.disease) {
          setDisease(responseData.disease);
          Alert.alert("Disease Updated successfully");
        } else {
          console.error('Invalid response data:', responseData);
        }
      } else {
        console.error('Failed to add disease. Status:', response.status);
      }
    } catch (error) {
      console.error('Error adding disease:', error);
    }
  };
  
  const handleMedications = () => {
    navigation.navigate("ViewMedications", { patientId, patientDetails })
  }
  const handleTests = () => {
    navigation.navigate("ViewTests", { patientId, patientDetails })
  }

  const handlePrescription = () => {
    navigation.navigate("GeneratePrescription", { patientId, patientDetails, vitals, symptoms, disease })
  }

  const handlePastHistory = () => {
    navigation.navigate("PastHistory", { patientId, patientDetails })
  }
  const handleSymptomImages = () => {
    navigation.navigate("SymptomsImages", { patientId })
  }
  const handleIP = () => {
    fetchDoctorDetails();
    const spec = doctorDetails.specialization;
    navigation.navigate("RecommendIP", { patientId, patientDetails, spec })
  }

  const handleProgress = () => {
    navigation.navigate("RecordProgress", { patientId, patientDetails })
  }

  const handleDischarge = async () => {
    Alert.alert(
      'Confirm Discharge',
      'Are you sure you want to discharge this patient?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_BASE_URL}/doctor/discharge/${patientId}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                navigation.navigate("DoctorPatientDetails", { shouldFetchData: true })
              }
            } catch (error) {
              console.error('Error discharging patient:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.flexContainer}>
        {isSidebarOpen && (
          <DoctorSideBar navigation={navigation} isSidebarOpen={isSidebarOpen} />
        )}
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Patient Details</Text>
          </View>
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
              <TouchableOpacity
                style={styles.ButtonContainer}
                onPress={handleSymptomImages}
              >
                <Text style={styles.ButtonText}>View Images</Text>
              </TouchableOpacity>
            </View>
          </View>
          {disease ? (
              <View style={styles.diseaseView}>
                <Text>
                  <Text style={styles.diseaseText}>Disease:</Text> {disease}
                </Text>

              </View>
            ) : (
              <View style={styles.emptyView}>
                <Text style={styles.emptyText}>Set disease:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setNewDisease(text)}
                  value={newDisease}
                  placeholder="Enter disease"
                />
                <TouchableOpacity onPress={handleAddDisease} style={styles.ButtonContainer}>
                  <Text style={styles.ButtonText}>Add Disease</Text>
                </TouchableOpacity>
              </View>
          )}
          
          <TouchableOpacity
            style={styles.ButtonContainer}
            onPress={handleDischarge}
          >
            <Text style={styles.ButtonText}>Discharge</Text>
          </TouchableOpacity>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={handlePastHistory}
            >
              <RadioButton
                value="viewHistory"
                status={selectedAction === 'viewHistory' ? 'checked' : 'unchecked'}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>View Past History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={handleMedications}
            >
              <RadioButton
                value="medications"
                status={selectedAction === 'medications' ? 'checked' : 'unchecked'}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>Medications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={handleTests}
            >
              <RadioButton
                value="tests"
                status={selectedAction === 'tests' ? 'checked' : 'unchecked'}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>Tests</Text>
            </TouchableOpacity>

            {doctorDetails && doctorDetails.department === 'IP' ? (
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={handleProgress}
              >
                <RadioButton
                  value="IP"
                  status={selectedAction === 'recordProgress' ? 'checked' : 'unchecked'}
                  color="#007BFF"
                />
                <Text style={styles.radioLabel}>Record Progress</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={handleIP}
              >
                <RadioButton
                  value="OP"
                  status={selectedAction === 'recommendIP' ? 'checked' : 'unchecked'}
                  color="#007BFF"
                />
                <Text style={styles.radioLabel}>Recommend to IP</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={handlePrescription}
            >
              <RadioButton
                value="prescription"
                status={selectedAction === 'prescription' ? 'checked' : 'unchecked'}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>Generate Prescription</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

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
    marginLeft: 20,
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
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  radioLabel: {
    marginLeft: 10,
    color: '#007BFF',
  },
  ButtonContainer: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    width: 135,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
    marginRight: 10, 
  },
  input: {
    width: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10, 
  },
  diseaseView: {
    marginTop: 20,
    marginLeft: 20,
  },
  diseaseText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DoctorPatientDashboard;
