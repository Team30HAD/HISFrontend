import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import DoctorSideBar from './DoctorSideBar';
import DoctorHeader from './DoctorHeader';
import { API_BASE_URL } from '../config';
import {useEmail} from '../Context/EmailContext';

const DoctorHome = ({  route,navigation }) => {
  const { email } = useEmail();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setLoading(false);
    }
  };
  
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { shouldFetchData: shouldFetchDataParam } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      if (shouldFetchData || shouldFetchDataParam) {
        fetchDoctorDetails();
        setShouldFetchData(false);
      }
    }, [shouldFetchData, shouldFetchDataParam])
  );
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.shouldFetchData || shouldFetchDataParam) {
        setShouldFetchData(true);
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params?.shouldFetchData, shouldFetchDataParam]);
  
  

  return (
    <View style={styles.container}>
      <DoctorHeader onPress={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && <DoctorSideBar navigation={navigation}/>}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.detailsContainer}>
            {doctorDetails ? (
              <>
                <Text style={styles.detailText}>Name: {doctorDetails.name}</Text>
                <Text style={styles.detailText}>Age: {doctorDetails.age}</Text>
                <Text style={styles.detailText}>Qualification: {doctorDetails.qualification}</Text>
                <Text style={styles.detailText}>Specialization: {doctorDetails.specialization.specializationName}</Text>
                <Text style={styles.detailText}>Department: {doctorDetails.department}</Text>
              </>
            ) : (
              <Text>Loading doctor details...</Text>
            )}
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
  content:{
    flex: 1,
    flexDirection:'row',
    width: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20, 
    paddingTop: 20,
  },
  detailsContainer: {
    flex: 1, 
    padding: 20,
  },
  detailText: {
    fontSize: 30,
    marginBottom: 10,
  },
});


export default DoctorHome;
