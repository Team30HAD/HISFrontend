import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios'; // Import axios library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmail } from '../Context/EmailContext';
import { API_BASE_URL } from '../config';
import Nurse_Pic from "../Nurse_Comp_Images/Nurse_Pic.png";

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

const NurseSidebar = ({ navigation, nurse, activeRoute }) => {
  //const [activeOption, setActiveOption] = useState(null);
  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nurseDetails, setNurseDetails] = useState(null);
  const [nurseSchedule, setNurseSchedule] = useState([]);
  const [nurseId, setNurseId] = useState(null); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchNurseDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/nurse/getNurseDetailsByEmail/${email}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const nurseId = response.data.nurseId;
        setNurseId(nurseId);
        setNurseDetails(response.data);
      } catch (error) {
        console.error('Error fetching nurse details:', error);
      }
    };

    fetchNurseDetails();
  }, [nurseId]);

  //const { name, email } = nurse;
  const navigateToScreen = (route) => () => {
    //setActiveOption(route);
    navigation.navigate(route); // Navigate to the specified route
    // if (route === 'Home') {
    //   navigation.navigate(route);
    // } else {
    //   navigation.navigate(route);
    // }
    // if (route === 'Patient_Details') {
    //   navigation.navigate(route);
    // } else {
    //   navigation.navigate(route);
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={Nurse_Pic} style={styles.profileImage} />
      
        {nurseDetails ? (
              <>
                <Text style={styles.profileText}>{nurseDetails.name}</Text>
                <Text style={styles.profileText}>Contact: {nurseDetails.contact}</Text>
                <Text style={styles.profileText}>Email: {nurseDetails.email}</Text>
              </>
            ) : (
              <Text>Loading nurse details...</Text>
            )}
        <Text style={styles.profileText}>Nurse</Text>
      </View>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen('NurseHome')}>
        <Text style={[styles.item, activeRoute === 'NurseHome' && styles.activeItem]}>Home</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen('NursePatient_Details')}>
        <Text style={[styles.item, activeRoute === 'NursePatient_Details' && styles.activeItem]}>Patient Details</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
      <TouchableOpacity onPress={navigateToScreen('HomePage')}>
        <Text style={[styles.item, activeRoute === 'HomePage' && styles.activeItem]}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: -1,
    backgroundColor: '#008080', // Sidebar background color
    width: 240, // Sidebar width
    alignItems: 'center', // Center items horizontally
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 10, // Add padding to the top
    marginTop: 0, // Adjust margin to overlap with NurseHeader
    //paddingHorizontal: 20, // Horizontal padding for items
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    
    color: 'lightcyan', // Very light yellow 
  },
  item: {
    fontSize: 25,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'lavender', // Light teal colorgive
  },
  activeItem: {
    color: 'lightsalmon', // Change color for active item
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'lavender',
    marginTop: 5,
    marginBottom: 5,
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarClosed: {
    left: -200,
  },
});

export default NurseSidebar;
