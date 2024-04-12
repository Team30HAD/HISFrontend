import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, ScrollView,Dimensions,Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const EditReceptionistScreen = ({ route, navigation }) => {
  const { receptionistId } = route.params;
  const [receptionistDetails, setReceptionistDetails] = useState(null);
  const [editedReceptionistDetails, setEditedReceptionistDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
  
        // Fetch the image data as a blob
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
  
        // Convert the blob to a Base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setEditedReceptionistDetails({ ...editedReceptionistDetails, photo: base64String });
        };
        reader.readAsDataURL(blob);
      } else {
        // Provide feedback to the user if image picking is cancelled
        Alert.alert('Image picking cancelled', 'You cancelled image picking.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image');
    }
  };
  
  const removePhoto = () => {
    setEditedReceptionistDetails({ ...editedReceptionistDetails, photo: null });
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
    fetchReceptionistDetails();
  }, []);
  
  const fetchReceptionistDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/viewReceptionist/${receptionistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const receptionistData = response.data;
      setReceptionistDetails(receptionistData);
      setEditedReceptionistDetails({
        name: receptionistData.name,
        age: receptionistData.age.toString(),
        sex: receptionistData.sex,
        contact: receptionistData.contact,
        photo: receptionistData.photo
      });
    } catch (error) {
      console.error('Error fetching receptionist details:', error);
      setError('Failed to fetch receptionist details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedReceptionistDetails({ ...editedReceptionistDetails, [field]: value });
  };

  const handleSave = async () => {
    const { name, contact, age,sex,photo,active} = editedReceptionistDetails;
    if (!name || !age || !sex ||  !contact ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    if (!validateName(name)) {
      Alert.alert('Error', 'Name should contain only letters and spaces.');
      return;
    }
  
    if (!validateAge(age)) {
      Alert.alert('Error', 'Age should be a number between 0 and 150.');
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
        photo,
        name,
        age,
        sex,
        contact,
        active,
      };
      await axios.put(`${API_BASE_URL}/admin/editReceptionist/${receptionistId}`, editedFields,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
     // await axios.put(`http://172.16.145.146:8080/admin/editReceptionist/${receptionistId}`, editedReceptionistDetails);
      Alert.alert('Success', 'Receptionist details updated successfully.');
      if (route.params && route.params.onSaveSuccess) {
        route.params.onSaveSuccess(); // Call the onSaveSuccess callback function
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error updating receptionist details:', error);
      setError('Failed to update receptionist details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
     <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="ViewReceptionists"/>
      <View style={styles.content}>
       {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Edit Receptionist {receptionistId}</Text>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={editedReceptionistDetails.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <Text>Age:</Text>
      <TextInput
        style={styles.input}
        value={editedReceptionistDetails.age}
        onChangeText={(value) => handleInputChange('age', value)}
      />

      <Text>Gender:</Text>
      <Picker
        selectedValue={editedReceptionistDetails.sex}
        onValueChange={(value) => handleInputChange('sex', value)}
        style={styles.input}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text>Contact:</Text>
      <TextInput
        style={styles.input}
        value={editedReceptionistDetails.contact}
        onChangeText={(value) => handleInputChange('contact', value)}
      />
      <Button
        title="Edit Profile Picture"
        onPress={pickImage} 
        style={{ width: 200, height: 40, backgroundColor: 'blue', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
      />

    {editedReceptionistDetails.photo && (
    <View style={styles.imageContainer}>
    <Image
      source={{ uri: editedReceptionistDetails.photo }}
      style={styles.circularImage}
    />
    <TouchableOpacity onPress={removePhoto} style={styles.removeButton}>
      <Text style={styles.removeButtonText}>Remove Photo</Text>
    </TouchableOpacity>
    </View>
    )}
      <Button title="Save" onPress={handleSave} />
      
      {error && <Text style={styles.error}>{error}</Text>}
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
  // Add or modify styles as needed
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
    fontSize: 24, // Adjust the font size as needed
    marginBottom: 20, // Add margin bottom for spacing
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  circularImage: {
    width: 200,
    height: 200,
    borderRadius: 100, // half of width and height for circular shape
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

export default EditReceptionistScreen;
