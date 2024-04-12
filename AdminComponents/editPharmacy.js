import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,ScrollView } from 'react-native';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const EditPharmacyScreen = ({ route, navigation }) => {
  const { pharmacyId, onSaveSuccess } = route.params;
  const [pharmacyDetails, setPharmacyDetails] = useState(null);
  const [editedPharmacyDetails, setEditedPharmacyDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validateName = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(text);
  };

  const validateAge = (text) => {
    const ageNum = parseInt(text);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
  };

  const validateTime = (text) => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(text);
  };
  

  const validatePhoneNumber = (text) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(text);
  };

  useEffect(() => {
    fetchPharmacyDetails();
  }, []);

  const fetchPharmacyDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token'); 
      const response = await axios.get(`${API_BASE_URL}/admin/viewPharmacy/${pharmacyId}`,{
        headers :{
          Authorization: `Bearer ${token}`
        }
      });
      const pharmacyData = response.data;
      setPharmacyDetails(pharmacyData);
      setEditedPharmacyDetails({
        name: pharmacyData.name,
        address: pharmacyData.address,
        contact: pharmacyData.contact,
        licenseNumber: pharmacyData.licenseNumber,
        pharmacyId: pharmacyData.pharmacyId,
        Id: pharmacyData.Id,
        active: pharmacyData.active,
        password: pharmacyData.password,
        email: pharmacyData.email
      });
    } catch (error) {
      console.error('Error fetching pharmacy details:', error);
      setError('Failed to fetch pharmacy details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedPharmacyDetails({ ...editedPharmacyDetails, [field]: value });
  };

  const handleSave = async () => {
    const { name, contact, address,licenseNumber,active} = editedPharmacyDetails;
    if (!name || !contact || !licenseNumber || !address) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    if (!validateName(name)) {
      Alert.alert('Error', 'Name should contain only letters and spaces.');
      return;
    }
  
    if (!validatePhoneNumber(contact)) {
      Alert.alert('Error', 'Invalid phone number.Enter a valid phone number of 10 digits');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token'); 
      const editedFields = {
        name,
        address,
        contact,
        active,
        licenseNumber
      };
      await axios.put(`${API_BASE_URL}/admin/editPharmacy/${pharmacyId}`, editedFields,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      Alert.alert('Success', 'Pharmacy details updated successfully.');
      onSaveSuccess(); 
      navigation.goBack();
    } catch (error) {
      console.error('Error updating pharmacy details:', error);
      setError('Failed to update pharmacy details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="ViewPharmacies"/>
      <View style={styles.content}>
       {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Edit Pharmacies {pharmacyId}</Text>
      <Text>Name: </Text>
      <TextInput
        style={styles.input}
        value={editedPharmacyDetails.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <Text>Address</Text>
      <TextInput
        style={styles.input}
        value={editedPharmacyDetails.address}
        onChangeText={(value) => handleInputChange('address', value)}
      />
      <Text>Contact</Text>
      <TextInput
        style={styles.input}
        value={editedPharmacyDetails.contact}
        onChangeText={(value) => handleInputChange('contact', value)}
      />
      <Text>License Number</Text>
      <TextInput
        style={styles.input}
        value={editedPharmacyDetails.licenseNumber}
        onChangeText={(value) => handleInputChange('licenseNumber', value)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text>Save</Text>
      </TouchableOpacity>
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
    paddingTop: 100,
    marginTop: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
      formContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 20,
      },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24, 
    marginBottom: 20, 
  },
});
export default EditPharmacyScreen;
