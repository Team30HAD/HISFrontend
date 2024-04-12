import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, ScrollView,Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';

const EditDoctorScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [editDoctorDetails, setEditedDoctorDetails] = useState({});
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

  const validatePhoneNumber = (text) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(text);
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token'); 
      const response = await axios.get(`${API_BASE_URL}/admin/viewDoctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const doctorData = response.data;
      setEditedDoctorDetails(doctorData);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setError('Failed to fetch doctor details');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const selectedAsset = result.assets[0];
        const selectedImageUri = selectedAsset.uri;

        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setEditedDoctorDetails({ ...editDoctorDetails, photo: base64String });
        };
        reader.readAsDataURL(blob);
      } else {
        Alert.alert('Image picking cancelled', 'You cancelled image picking.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedDoctorDetails({ ...editDoctorDetails, [field]: value });
  };

  const removePhoto = () => {
    setEditedDoctorDetails({ ...editDoctorDetails, photo: null });
  };

  const handleSave = async () => {
    const { name, age, sex, qualification, specialization, contact, department, licenseNumber,photo,active} = editDoctorDetails;
    if (!name || !age || !sex || !qualification || !specialization || !department || !contact || !licenseNumber) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    if (!validateName(name)) {
      Alert.alert('Error', 'Name should contain only letters and spaces.');
      return;
    }
  
    if (!validateName(qualification)) {
      Alert.alert('Error', 'Qualification should contain only letters and spaces.');
      return;
    }
  
    if (!validateAge(age)) {
      Alert.alert('Error', 'Age should be a number between 0 and 150.');
      return;
    }
    
    if (!validatePhoneNumber(contact)) {
      Alert.alert('Error', 'Invalid phone number. Enter a valid phone number of 10 digits');
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const editedFields = {
        photo,
        name,
        age,
        sex,
        qualification,
        specialization,
        contact,
        department,
        licenseNumber,
        active,
      };
      const response = await fetch(`${API_BASE_URL}/admin/editDoctor/${doctorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedFields),
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Doctor details updated successfully.');
        if (route.params && route.params.onSaveSuccess) {
          route.params.onSaveSuccess();
        }
        navigation.goBack();
      } else {
        throw new Error('Failed to update doctor details.');
      }
    } catch (error) {
      console.error('Error updating doctor details:', error);
      setError('Failed to update doctor details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <View style={styles.container}>
     <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="ViewDoctors"/>
      <View style={styles.content}>
       {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Edit {editDoctorDetails.department} Doctor {doctorId}</Text>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={editDoctorDetails.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <Text>Age:</Text>
      <TextInput
        style={styles.input}
        value={editDoctorDetails.age !== undefined ? editDoctorDetails.age.toString() : ''}
        onChangeText={(value) => handleInputChange('age', value)}
      />

      <Text>Gender:</Text>
      <Picker
        selectedValue={editDoctorDetails.sex}
        onValueChange={(value) => handleInputChange('sex', value)}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text>Contact:</Text>
      <TextInput
        style={styles.input}
        value={editDoctorDetails.contact}
        onChangeText={(value) => handleInputChange('contact', value)}
      />

      <Text>Department:</Text>
      <Picker
        selectedValue={editDoctorDetails.department}
        onValueChange={(value) => handleInputChange('department', value)}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="IP" value="IP" />
        <Picker.Item label="OP" value="OP" />
      </Picker>

      <Text>Qualification:</Text>
      <TextInput
        style={styles.input}
        value={editDoctorDetails.qualification}
        onChangeText={(value) => handleInputChange('qualification', value)}
      />

      <Text>Specialization:</Text>
      <TextInput
        style={styles.input}
        value={editDoctorDetails.specialization}
        onChangeText={(value) => handleInputChange('specialization', value)}
      />

      <Text>License Number:</Text>
      <TextInput
        style={styles.input}
        value={editDoctorDetails.licenseNumber}
        onChangeText={(value) => handleInputChange('licenseNumber', value)}
      />

<Button
        title="Edit Profile Picture"
        onPress={pickImage} // Define pickImage function
        style={{ width: 200, height: 40, backgroundColor: 'blue', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
      />

    {editDoctorDetails.photo && (
    <View style={styles.imageContainer}>
    <Image
      source={{ uri: editDoctorDetails.photo }}
      style={styles.circularImage}
    />
    <TouchableOpacity onPress={removePhoto} style={styles.removeButton}>
      <Text style={styles.removeButtonText}>Remove Photo</Text>
    </TouchableOpacity>
    </View>
    )}
      <Button title="Save" onPress={handleSave} />
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:20
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20, 
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularImage: {
    width: 200,
    height: 200,
    borderRadius: 100, 
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditDoctorScreen;
