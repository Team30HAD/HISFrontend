import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('OP');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchDoctors = useCallback(async (dept) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log('Request Headers:', headers); 
  
      const response = await axios.get(`${API_BASE_URL}/admin/viewDoctors/${dept}`, {
        headers: headers,
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, []);
  

  useEffect(() => {
    fetchDoctors(selectedDept);
  },[fetchDoctors,selectedDept]);

  const handleEdit = (doctorId) => {
    navigation.navigate('EditDoctorScreen', { 
      doctorId: doctorId,
      onSaveSuccess: fetchDoctors
    });
  };

  const handleDeactivate = async (doctorId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token); 
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log('Request Headers:', headers); 
  
      // Pass headers as the second argument, not as part of the request body
      await axios.put(`${API_BASE_URL}/admin/deactivateDoctor/${doctorId}`, null, {
        headers: headers,
      });
      fetchDoctors(selectedDept);
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };
  

  const toggleRadio = (dept) => {
    setSelectedDept(dept);
  };

  return (
    <View style={styles.container}>
      <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="RoleSelection"/>
      <View style={styles.content}>
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>View Doctors</Text>
          <View style={styles.departmentSelection}>
            <Text style={styles.departmentText}>Select Department:</Text>
            <TouchableOpacity onPress={() => toggleRadio('OP')} style={styles.radioContainer}>
              <MaterialIcons name={selectedDept === 'OP' ? 'radio-button-checked' : 'radio-button-unchecked'} size={24} color="black" />
              <Text style={styles.radioLabel}>OP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleRadio('IP')} style={styles.radioContainer}>
              <MaterialIcons name={selectedDept === 'IP' ? 'radio-button-checked' : 'radio-button-unchecked'} size={24} color="black" />
              <Text style={styles.radioLabel}>IP</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>S.No.</Text>
              <Text style={styles.headerText}>Doctor ID</Text>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Contact</Text>
              <Text style={styles.headerText}>Email</Text>
              <Text style={styles.headerText}>Highest Qualification</Text>
              <Text style={styles.headerText}>Action</Text>
            </View>
            {doctors && doctors.map((doctor, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{doctor.doctorId}</Text>
                <Text style={styles.tableCell}>{doctor.name}</Text>
                <Text style={styles.tableCell}>{doctor.contact}</Text>
                <Text style={styles.tableCell}>{doctor.email}</Text>
                <Text style={styles.tableCell}>{doctor.qualification}</Text>
                <View style={styles.actionContainer}>
                  <TouchableOpacity onPress={() => handleEdit(doctor.doctorId)}>
                    <MaterialIcons name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeactivate(doctor.doctorId)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
  backgroundColor: '#fff',
  paddingHorizontal: 20,
  paddingTop: 100,
},
scrollContainer: {
  flexGrow: 1,
        // alignItems: 'center',
  paddingTop: 100,
},
heading: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
departmentSelection: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
departmentText: {
  marginRight: 10,
},
radioContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 20,
},
radioLabel: {
  marginLeft: 5,
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
  width: 60,
},    
  innerContent: {
    flex: 1,
    flexDirection: 'row',
  },
  heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      },
      tableContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
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
        width: 60,
      },
});