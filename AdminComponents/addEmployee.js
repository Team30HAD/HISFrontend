import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, Alert , ScrollView, StyleSheet,Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
// import * as ImagePicker from 'react-native-image-picker'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation, validatePathConfig } from '@react-navigation/native'; 
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// var ImagePicker = require('react-native-image-picker');
const AddEmployee = () => {
  const navigation = useNavigation();
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [department, setDepartment] = useState('');
  const [photo, setPhoto] = useState(null); 
  const [contact,setContact] = useState('');
  const [licenseNumber,setLicenseNumber] = useState('');
  const [address,setAddress] = useState('');
  const [nurseSchedules, setNurseSchedules] = useState([{ day: "MONDAY", start_time: '', end_time: '' }])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [specializationList, setSpecializationList] = useState([]);
  var fetched = true;

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
  

  const handleRoleChange = (value) => {
    setRole(value);
    setName('');
    setAge('');
    setSex('Male');
    setQualification('');
    setSpecialization('');
    setSpecializationList([]);
    setDepartment('');
    setPhoto('');
    setContact('');
    setLicenseNumber('');
    setAddress('');
    setNurseSchedules([{ day: "MONDAY", start_time: '', end_time: '' }])
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleAgeChange = (value) => {   
    setAge(value);
  };

  const handleSexChange = (value) => {
    setSex(value);
  };

  const handleQualificationChange = (value) => {
    setQualification(value);
  };

  const handleSpecializationChange = (value) => {
    setSpecialization(value);
    fetchSpecializations(value);
  };

  const handleDepartmentChange = (value) => {
      setDepartment(value);
  };
  const handleContactChange = (value) => {
    setContact(value);
  };
  const handleLicenseNumberChange = (value) => {
    setLicenseNumber(value);
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
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
          setPhoto(base64String);
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

  const fetchSpecializations = async () => {
    try {
      fetched = true;
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/viewSpecializations`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSpecializationList(data); 
      } else {
        console.error('Failed to fetch specialization names:', response.statusText);
        // Handle the error condition, such as displaying an error message to the user
        // You can use setState to set a default value for specializationList or handle it accordingly
      }
    } catch (error) {
      console.error('Error fetching specialization names:', error.message);
      // Handle the error condition, such as displaying an error message to the user
      // You can use setState to set a default value for specializationList or handle it accordingly
    }
  };
  
  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const handleAddSchedule = () => {
    setNurseSchedules([...nurseSchedules, { day: '', start_time: '', end_time: '' }])
  };
  const handleRemoveSchedule = (index) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules.splice(index, 1);
    setNurseSchedules(updatedNurseSchedules);
  };
  const handleScheduleDayChange = (index, value) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules[index].day = value;
    setNurseSchedules(updatedNurseSchedules);
  };

  const handleScheduleStartTimeChange = (index, value) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules[index].start_time = value;
    setNurseSchedules(updatedNurseSchedules);
  };

  const handleScheduleEndTimeChange = (index, value) => {
    const updatedNurseSchedules = [...nurseSchedules];
    updatedNurseSchedules[index].end_time = value;
    setNurseSchedules(updatedNurseSchedules);
  };

  useEffect(() => {
    if (role === 'doctor') {
      fetchSpecializations();
    }
  }, [role]);
  
  // useEffect(() => {
  //   if (fetched) {
  //     fetchSpecializations();
  //   }
  // }, [fetched]);
  
  // useEffect(() => {
  //     fetchSpecializations();
  //     if(fetched){
  //       fetchSpecializations();
  //     }
  // }, [fetched]);

  const submitNurse = async () => {
    if (!name || !age || !sex || !contact || !nurseSchedules ) {
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
    // if (!validateName(specialization)) {
    //   Alert.alert('Error', 'Specialization should contain only letters and spaces.');
    //   return;
    // }
  
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

    try {
      const token = await AsyncStorage.getItem('token');
      const apiUrl = `${API_BASE_URL}/admin/addNurse`;
      const roleName = 'Nurse';
      const requestBody = {
        name,
        age,
        sex,
        contact,
        photo,
        nurseSchedules
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify(requestBody), 
      });
  
      if (response.ok) {
        Alert.alert('Success', `${roleName} added successfully!`);
        // Reset all state variables
        setRole(role);
        setName('');
        setAge('');
        setSex('');
        setContact('');
        setPhoto(null); 
        setNurseSchedules([{ day: "MONDAY", start_time: '', end_time: '' }])
        console.log(`${roleName} added successfully!`);      
      } else {
        Alert.alert('Error', `Failed to add ${roleName.toLowerCase()}`);
        console.error(`Failed to add ${roleName.toLowerCase()}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error adding Nurse:`, error.message);
    }
  };

  const submitPharmacy = async () => {
    const token = await AsyncStorage.getItem('token');
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
    try {
      const apiUrl = `${API_BASE_URL}/admin/addPharmacy`;
      const roleName = 'Pharmacy';
      const requestBody = {
        name,
        contact,
        address,
        licenseNumber,
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify(requestBody), 
      });
  
      if (response.ok) {
        Alert.alert('Success', `${roleName} added successfully!`);
        setRole(role);
        setName('');
        setContact('');
        setLicenseNumber('');
        setAddress('');
        console.log(`${roleName} added successfully!`);      
      } else {
        Alert.alert('Error', `Failed to add ${roleName.toLowerCase()}`);
        console.error(`Failed to add ${roleName.toLowerCase()}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error adding Nurse:`, error.message);
    }
  };
  const submitDoctor = async () => {
    if (!name || !age || !sex || !qualification || !department || !contact || !licenseNumber || !specialization) {
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
      Alert.alert('Error', 'Invalid phone number.Enter a valid phone number of 10 digits');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const apiUrl = `${API_BASE_URL}/admin/addDoctor/${specialization}`;
      const roleName = 'Doctor';
      const requestBody = {
        name,
        age,
        sex,
        qualification,
        department,
        contact,
        licenseNumber,
        photo
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), 
      });
  
      if (response.ok) {
        Alert.alert('Success', `${roleName} added successfully!`);
        setRole(role);
        setName('');
        setAge('');
        setSex('Male');
        setQualification('');
        setSpecialization('');
        setDepartment('');
        setPhoto(null); 
        setContact('');
        setLicenseNumber('');
        console.log(`${roleName} added successfully!`); 
        fetched = true;     
      } else {
        Alert.alert('Error', `Failed to add ${roleName.toLowerCase()}`);
        console.error(`Failed to add ${roleName.toLowerCase()}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error adding Doctor:`, error.message);
    }
  };
  
  const submitReceptionist = async () => {
    const token = await AsyncStorage.getItem('token');
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
    try {
      const apiUrl = `${API_BASE_URL}/admin/addReceptionist`;
      const roleName = 'Receptionist';
      const requestBody = {
        name,
        age,
        sex,
        contact,
        photo,
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), 
      });
  
      if (response.ok) {
        Alert.alert('Success', `${roleName} added successfully!`);
        setRole(role);
        setName('');
        setAge('');
        setSex('');
        setContact('');
        setPhoto(null); 
        console.log(`${roleName} added successfully!`);      
      } else {
        Alert.alert('Error', `Failed to add ${roleName.toLowerCase()}`);
        console.error(`Failed to add ${roleName.toLowerCase()}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error adding Nurse:`, error.message);
    }
  };

  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  return (
   
    <View style={styles.container}>
     <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination={"AdminHome"}/>
      <View style={styles.content}>
       {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Add {role} </Text>
      <Text>Role:</Text>
      <Picker
        selectedValue={role}
        onValueChange={handleRoleChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Nurse" value="nurse" />
        <Picker.Item label="Doctor" value="doctor" />
        <Picker.Item label="Pharmacy" value="pharmacy" />
        <Picker.Item label="Receptionist" value="receptionist" /> 
      </Picker>

      {role === 'doctor' && (
      // <ScrollView>
      <View>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={handleNameChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

      <Text>Age:</Text>
      <TextInput
        value={age}
        onChangeText={handleAgeChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

     <Text>Gender:</Text>
      <Picker
        selectedValue={sex}
        onValueChange={handleSexChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text>Highest Qualification:</Text>
      <TextInput
        value={qualification}
        onChangeText={handleQualificationChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

      <Text>Specialization:</Text>
      <Picker
        selectedValue={specialization}
        onValueChange={handleSpecializationChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Select Specialization" value="" />
        {specializationList && specializationList.map((specializationItem, index) => (
          <Picker.Item key={index} label={specializationItem} value={specializationItem} />
        ))}
      </Picker>

      <Text>Department:</Text>
      <CheckBox
        title="OP"
        checked={department === 'OP'}
        onPress={() => handleDepartmentChange('OP')}
      />
      <CheckBox
        title="IP"
        checked={department === 'IP'}
        onPress={() => handleDepartmentChange('IP')}
      />

      <Text>Contact:</Text>
      <TextInput
        value={contact}
        onChangeText={handleContactChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />
      
      <Text>License Number:</Text>
      <TextInput
        value={licenseNumber}
        onChangeText={handleLicenseNumberChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

<TouchableOpacity onPress={handlePickImage} style={styles.addPictureButton}>
        {photo ? (
          <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Text style={styles.addPictureButtonText}>Add Profile Picture</Text>
        )}
      </TouchableOpacity>

      {photo && (
        <TouchableOpacity onPress={() => setPhoto(null)} style={styles.addButtonToRemovePicture}>
          <Text style={styles.addButtonToRemovePictureText}>Remove Picture</Text>
        </TouchableOpacity>
      )}

      <Button title="Add" onPress={submitDoctor} />
        </View>
        // </ScrollView>
      )}
        {role == 'nurse' && (
        //  <ScrollView >
          <View>
            <Text>Name:</Text>
            <TextInput
              value={name}
              onChangeText={handleNameChange}
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
            />
        
            <Text>Age:</Text>
            <TextInput
              value={age}
              onChangeText={handleAgeChange}
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
            />
        
            <Text>Gender:</Text>
            <Picker
              selectedValue={sex}
              onValueChange={handleSexChange}
              style={{ height: 50, width: 200 }}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
        
            <Text>Contact:</Text>
            <TextInput
              value={contact}
              onChangeText={handleContactChange}
              style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
            />
            
            <Text>Schedule:</Text>
            {nurseSchedules.map((schedule, index) => (
  <View key={index}>
    <Picker
      selectedValue={schedule.day}
      onValueChange={(value) => handleScheduleDayChange(index, value)}
      style={{ height: 50, width: 200 }}
    >
      {daysOfWeek.map(day => (
        <Picker.Item key={day} label={day} value={day} />
      ))}
    </Picker>
    <Text>Start Time: </Text>
    <TextInput
      value={schedule.start_time}
      onChangeText={(value) => handleScheduleStartTimeChange(index, value)}
      placeholder="Start Time"
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
    />
    <Text> End Time: </Text>
    <TextInput
      value={schedule.end_time}
      onChangeText={(value) => handleScheduleEndTimeChange(index, value)}
      placeholder="End Time"
      style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
    />
   {index > 0 && ( // Render "Remove" button if not the first schedule
      <TouchableOpacity onPress={() => handleRemoveSchedule(index)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove Schedule</Text>
      </TouchableOpacity>
    )}
  </View>
))}

            <Button title="Add Schedule" onPress={handleAddSchedule} />
            
            <TouchableOpacity onPress={handlePickImage} style={styles.addPictureButton}>
        {photo ? (
          <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Text style={styles.addPictureButtonText}>Add Profile Picture</Text>
        )}
      </TouchableOpacity>

      {photo && (
        <TouchableOpacity onPress={() => setPhoto(null)} style={styles.addButtonToRemovePicture}>
          <Text style={styles.addButtonToRemovePictureText}>Remove Picture</Text>
        </TouchableOpacity>
      )}

            <Button title="Add" onPress={submitNurse} />
          </View>
          // </ScrollView>
        )}
      
       {role === 'pharmacy' && (
        // <ScrollView>
        <View>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={handleNameChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

      <Text>Contact:</Text>
      <TextInput
        value={contact}
        onChangeText={handleContactChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />
      <Text>Address:</Text>
      <TextInput
        value={address}
        onChangeText={handleAddressChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />
      
      <Text>License Number:</Text>
      <TextInput
        value={licenseNumber}
        onChangeText={handleLicenseNumberChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

      <Button title="Add" onPress={submitPharmacy} />
        </View>
        // </ScrollView>
      )} 

    {role === 'receptionist' && (
    //  <ScrollView>
      <View>
      <Text>Name:</Text>
      <TextInput
        value={name}
        onChangeText={handleNameChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />


      <Text>Age:</Text>
      <TextInput
        value={age}
        onChangeText={handleAgeChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

     <Text>Gender:</Text>
      <Picker
        selectedValue={sex}
        onValueChange={handleSexChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Text>Contact:</Text>
      <TextInput
        value={contact}
        onChangeText={handleContactChange}
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />

      <TouchableOpacity onPress={handlePickImage} style={styles.addPictureButton}>
        {photo ? (
          <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Text style={styles.addPictureButtonText}>Add Profile Picture</Text>
        )}
      </TouchableOpacity>

      {photo && (
        <TouchableOpacity onPress={() => setPhoto(null)} style={styles.addButtonToRemovePicture}>
          <Text style={styles.addButtonToRemovePictureText}>Remove Picture</Text>
        </TouchableOpacity>
      )}
    
      <Button title="Add" onPress={submitReceptionist} />
        </View>
      )}
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
      heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
  addPictureButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addPictureButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },

  // Style for the "Add" button to remove the picture
  addButtonToRemovePicture: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  addButtonToRemovePictureText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddEmployee;
