import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, FlatList ,Alert, ImageBackground} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PharmacyHeader from './PharmacyHeader';
import PharmacySidebar from './PharmacySidebar';
import { API_BASE_URL } from '../config';
import {useEmail} from '../Context/EmailContext';

export default function ViewMedication({ navigation }) {
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [medications, setMedications] = useState([]);
  const [search, setSearch] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = async () => {
    const patientIdPattern = /^P\d{2}$/;

    if (!patientIdPattern.test(patientId)) {
      Alert.alert('Invalid Patient ID', 'Patient ID should start with P followed by two numbers.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('pharmacytoken');
      const response = await axios.get(`${API_BASE_URL}/pharmacy/viewMedication/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedications(response.data);
      setSearch(true);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };
  const handleServeMedication = async (medicineId) => {
    try {
      const token = await AsyncStorage.getItem('pharmacytoken');
      const response = await axios.put(`${API_BASE_URL}/pharmacy/serve/${medicineId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Medication Served', 'The medication has been served successfully.');
      handleSearch();
    } catch (error) {
      console.error('Error serving medication:', error);
      Alert.alert('Error', 'Failed to serve medication. Please try again.');
    }
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <Text style={styles.medicationName}>{item.medicineName}</Text>
      <View style={styles.medicationDetails}>
        <Text style={styles.detailLabel}>Prescribed Date:</Text>
        <Text style={styles.detailText}>{item.prescribedOn}</Text>
      </View>
      <View style={styles.medicationDetails}>
        <Text style={styles.detailLabel}>Dosage:</Text>
        <Text style={styles.detailText}>{item.dosage}</Text>
      </View>
      <View style={styles.medicationDetails}>
        <Text style={styles.detailLabel}>Frequency:</Text>
        <Text style={styles.detailText}>{item.frequency}</Text>
      </View>
      <TouchableOpacity style={styles.serveButton} onPress={() => handleServeMedication(item.medicineId)}>
        <Text style={styles.serveButtonText}>Serve</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <PharmacyHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && <PharmacySidebar navigation={navigation} email={email} activeRoute="PharmacyPatient_Details"/>}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <ImageBackground source={{uri: "https://png.pngtree.com/background/20210710/original/pngtree-flat-cartoon-medical-blue-banner-poster-background-picture-image_1040368.jpg"}} style={styles.image}>
            <View style={styles.searchContainer}>
            <Text style={styles.infoText}>Enter the Patient ID to view medications prescribed</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Patient ID"
              value={patientId}
              onChangeText={setPatientId}
            />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </ImageBackground>
          {search && (
          <View style={styles.medicationContainer}>
            <Text style={styles.medicationHeading}>Prescribed Medications</Text>
            {medications.length === 0 ? (
              <Text style={styles.noMedicationsText}>No medications found for the patient.</Text>
            ) : (
              <FlatList
                data={medications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMedicationItem}
              />
            )}
          </View>
        )}

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
    // width: '100%',
    // backgroundColor: '#ffffff',
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 150,
  },
  infoText: {
    marginBottom: 10,
    marginRight: 50,
    fontSize: 18,
    color: 'teal',
  },
  image: {
    width: '100%',
    height: 400, // Adjust height as needed
    alignItems: "center", // Align input and delete button vertically
    justifyContent: "space-between",
  },
  input: {
    flexDirection: "row", // Add flexDirection to align input and delete button horizontally
    alignItems: "center", // Align input and delete button vertically
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "teal",
    backgroundColor: "lightgoldenrodyellow",
    paddingHorizontal: 10,
    marginRight: 50,
    height: 50,
    width: 400,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: 'teal',
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 100,
    marginRight: 50,
  },
  searchButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  medicationContainer: {
    flex: 1,
    padding: 20,
  },
  medicationHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'teal',
  },
  medicationItem: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'lightgoldenrodyellow',
    shadowColor: 'teal',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'lightseagreen'
  },
  medicationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  detailText: {
    fontSize: 16,
  },
  serveButton: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  serveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noMedicationsText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
