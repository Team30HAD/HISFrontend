import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, ScrollView,Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const EditNurseScreen = ({ route, navigation }) => {
  const { nurseId } = route.params;
  const [nurseDetails, setNurseDetails] = useState(null);
  const [editedNurseDetails, setEditedNurseDetails] = useState({});
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
          setEditedNurseDetails({ ...editedNurseDetails, photo: base64String });
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
    setEditedNurseDetails({ ...editedNurseDetails, photo: null });
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
    fetchNurseDetails();
  }, []);

  const fetchNurseDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/viewNurse/${nurseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nurseData = response.data;
      setNurseDetails(nurseData);
      setEditedNurseDetails({
        name: nurseData.name,
        age: nurseData.age.toString(),
        sex: nurseData.sex,
        contact: nurseData.contact,
        photo: nurseData.photo,
        nurseSchedules: nurseData.nurseSchedules
      });
    } catch (error) {
      console.error('Error fetching nurse details:', error);
      setError('Failed to fetch nurse details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedNurseDetails({ ...editedNurseDetails, [field]: value });
  };
  
  
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...editedNurseDetails.nurseSchedules];
    updatedSchedules[index][field] = value;
    setEditedNurseDetails({
      ...editedNurseDetails,
      nurseSchedules: updatedSchedules,
    });
  };

  const handleRemoveSchedule = (index) => {
    const updatedSchedules = [...editedNurseDetails.nurseSchedules];
    updatedSchedules.splice(index, 1); 
    setEditedNurseDetails({
      ...editedNurseDetails,
      nurseSchedules: updatedSchedules,
    });
  };
  
  const handleSave = async () => {
    const { name, age, sex, contact, nurseSchedules,photo,active } = editedNurseDetails;

    if (!name || !age || !sex || !contact || !nurseSchedules ) {
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
    for (const schedule of nurseSchedules) {
      if (!validateTime(schedule.start_time)) {
        Alert.alert('Error', `Invalid start time "${schedule.start_time}" . Please enter in HH:MM:SS (24H format)`);
        return;
      }
      
      if (!validateTime(schedule.end_time)) {
        Alert.alert('Error', `Invalid end time "${schedule.end_time}".Please enter in HH:MM:SS (24H format)`);
        return;
      }
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
        nurseSchedules
      };
      await axios.put(`${API_BASE_URL}/admin/editNurse/${nurseId}`, editedFields,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      Alert.alert('Success', 'Nurse details updated successfully.');
      if (route.params && route.params.onSaveSuccess) {
        route.params.onSaveSuccess(); 
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error updating nurse details:', error);
      setError('Failed to update nurse details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
    <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="ViewNurses" />
     <View style={styles.content}>
      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
       {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
       
       <ScrollView contentContainerStyle={styles.scrollContainer}>
       <Text style={styles.heading}>Edit Nurse {nurseId}</Text>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={editedNurseDetails.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <Text>Age:</Text>
      <TextInput
        style={styles.input}
        value={editedNurseDetails.age}
        onChangeText={(value) => handleInputChange('age', value)}
      />

      <Text>Gender:</Text>
      <Picker
        selectedValue={editedNurseDetails.sex}
        onValueChange={(value) => handleInputChange('sex', value)}
        style={styles.input}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text>Contact:</Text>
      <TextInput
        style={styles.input}
        value={editedNurseDetails.contact}
        onChangeText={(value) => handleInputChange('contact', value)}
      />

      {editedNurseDetails.nurseSchedules && editedNurseDetails.nurseSchedules.map((schedule, index) => (
        <View key={index} style={styles.scheduleContainer}>
          {/* <Text style={styles.scheduleHeaderText}>Schedule {index + 1}:</Text> */}
          <Text style={styles.label}>Day: {schedule.day}</Text>
          <Picker
            selectedValue={schedule.day}
            onValueChange={(value) => handleScheduleChange(index, 'day', value)}
            style={styles.picker}
          >
            <Picker.Item label="Monday" value="MONDAY" />
            <Picker.Item label="Tuesday" value="TUESDAY" />
            <Picker.Item label="Wednesday" value="WEDNESDAY" />
            <Picker.Item label="Thursday" value="THURSDAY" />
            <Picker.Item label="FRIDAY" value="FRIDAY" />
            <Picker.Item label="Saturday" value="SATURDAY" />
            <Picker.Item label="Sunday" value="SUNDAY" />
          </Picker>
          <Text>Start Time:</Text>
          <TextInput
            style={styles.input}
            value={schedule.start_time}
            onChangeText={(value) => handleScheduleChange(index, 'start_time', value)}
          />
          <Text>End Time:</Text>
          <TextInput
            style={styles.input}
            value={schedule.end_time}
            onChangeText={(value) => handleScheduleChange(index, 'end_time', value)}
          />
          {index > 0 && ( // Render "Remove" button if not the first schedule
      <TouchableOpacity onPress={() => handleRemoveSchedule(index)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove Schedule</Text>
      </TouchableOpacity>
    )}
        </View>
      ))}
      <Button
        title="Edit Profile Picture"
        onPress={pickImage} 
        style={{ width: 200, height: 40, backgroundColor: 'blue', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
      />

    {editedNurseDetails.photo && (
    <View style={styles.imageContainer}>
    <Image
      source={{ uri: editedNurseDetails.photo }}
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
export default EditNurseScreen;
