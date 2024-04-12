import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import {useEmail} from '../Context/EmailContext';

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};


const DoctorSideBar = () => {
  const navigation = useNavigation();
  const { email } = useEmail(); 

  const navigateToScreen = async (routeName) => {
    if (routeName === 'HomePage') {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/doctor/exitDutyDoctor/${email}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          await clearAsyncStorage();
          navigation.navigate(routeName);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      navigation.navigate(routeName, { shouldFetchData: true });
    }
  };


  
  

  return (
    <View style={styles.containersb}>
      <TouchableOpacity onPress={() => navigateToScreen('DoctorHome')}>
        <Text style={styles.item}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('DoctorPatientDetails')}>
        <Text style={styles.item}>View Patients</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('HomePage')}>
        <Text style={styles.item}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  containersb: {
    flex: 1,
    backgroundColor: '#669bed',
    width: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    marginTop: -19,
    marginLeft: -30,
    paddingHorizontal: 20,
  },
  item: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
  },
});

export default DoctorSideBar;

