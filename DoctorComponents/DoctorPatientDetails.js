import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import {useEmail} from '../Context/EmailContext';

const DoctorPatientDetails = ({ route, navigation }) => {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  

  const handlePatientDetailClick = (patientId) => {
    navigation.navigate('DoctorPatientDashboard', { patientId, shouldFetchData: true });
  };

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

  const fetchEmergencyPatients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/viewEmergencyPatients/${email}`, {
      headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmergencyPatients(data);
    } catch (error) {
      console.error('Error fetching emergency patients:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/doctor/viewPatients/${email}`, {
      headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { shouldFetchData: shouldFetchDataParam } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      if (shouldFetchData || shouldFetchDataParam) {
        fetchDoctorDetails();
        fetchEmergencyPatients();
        fetchPatients();
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

  
  if (!doctorDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <DoctorSideBar navigation={navigation} isSidebarOpen={isSidebarOpen} />
        )}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.tableContainer}>
            {doctorDetails.department === "IP" ? (
              <Text style={styles.mainHeading}>IP Patients</Text>
            ) : (
              <Text style={styles.mainHeading}>OP Patients</Text>
            )}
            <View>
              {emergencyPatients.length > 0 && (
                <View>
                  <Text style={styles.subHeading}>Emergency Patients</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.headerText}>S.No</Text>
                      <Text style={styles.headerText}>Patient Id</Text>
                      <Text style={styles.headerText}>Name</Text>
                      <Text style={styles.headerText}>Age</Text>
                      <Text style={styles.headerText}>Sex</Text>
                      <Text style={styles.headerText}>Contact</Text>
                      {doctorDetails.department === "IP" && (
                        <Text style={styles.headerText}>Bed ID</Text>
                      )}
                    </View>
                    {emergencyPatients.map((item, index) => (
                      <TouchableOpacity
                        style={styles.tableRow}
                        key={item.patientId}
                        onPress={() => handlePatientDetailClick(item.patientId)}
                      >
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{item.patientId}</Text>
                        <Text style={styles.tableCell}>{item.patientName}</Text>
                        <Text style={styles.tableCell}>{item.age}</Text>
                        <Text style={styles.tableCell}>{item.sex}</Text>
                        <Text style={styles.tableCell}>{item.contact}</Text>
                        {doctorDetails.department === "IP" && (
                          <Text style={styles.tableCell}>{item.bed.bId}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {patients.length > 0 && (
                <View>
                  <Text style={styles.subHeading}>General Patients</Text>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.headerText}>S.No</Text>
                      <Text style={styles.headerText}>Patient Id</Text>
                      <Text style={styles.headerText}>Name</Text>
                      <Text style={styles.headerText}>Age</Text>
                      <Text style={styles.headerText}>Sex</Text>
                      <Text style={styles.headerText}>Contact</Text>
                      {doctorDetails.department === "IP" && (
                        <Text style={styles.headerText}>Bed ID</Text>
                      )}
                    </View>
                    {patients.map((item, index) => (
                      <TouchableOpacity
                        style={styles.tableRow}
                        key={item.patientId}
                        onPress={() => handlePatientDetailClick(item.patientId)}
                      >
                        <Text style={styles.tableCell}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{item.patientId}</Text>
                        <Text style={styles.tableCell}>{item.patientName}</Text>
                        <Text style={styles.tableCell}>{item.age}</Text>
                        <Text style={styles.tableCell}>{item.sex}</Text>
                        <Text style={styles.tableCell}>{item.contact}</Text>
                        {doctorDetails.department === "IP" && (
                          <Text style={styles.tableCell}>{item.bed.bId}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  tableContainer: {
    marginTop: 10,
    flex: 1,
    padding: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },  
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    alignItems: 'center',
    color: 'black'
  },
  tableName: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});

export default DoctorPatientDetails;
