import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    nurses: 0,
    receptionists: 0,
    pharmacy: 0
  });
  const [hospitalDetails, setHospitalDetails] = useState(null);
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = async () => {
    try {
      // Fetch hospital details and counts data
    const token = await AsyncStorage.getItem('token');
    const hospitalDetailsResponse = await axios.get(`${API_BASE_URL}/admin/getHospitalDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const patientCountResponse = await axios.get(`${API_BASE_URL}/admin/patientCount`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      const doctorCountResponse = await axios.get(`${API_BASE_URL}/admin/doctorCount`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nurseCountResponse = await axios.get(`${API_BASE_URL}/admin/nurseCount`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const receptionistCountResponse = await axios.get(`${API_BASE_URL}/admin/receptionistCount`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pharmacyCountResponse = await axios.get(`${API_BASE_URL}/admin/pharmacyCount`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const hospitalDetailsData = hospitalDetailsResponse.data;
      const patientCount = patientCountResponse.data;
      const doctorCount = doctorCountResponse.data;
      const nurseCount = nurseCountResponse.data;
      const receptionistCount = receptionistCountResponse.data;
      const pharmacyCount = pharmacyCountResponse.data;

      setHospitalDetails(hospitalDetailsData);
      setCounts({
        patients: patientCount,
        doctors: doctorCount,
        nurses: nurseCount,
        receptionists: receptionistCount,
        pharmacy: pharmacyCount
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AdminHeader onPressMenu={toggleSidebar} showBackButton={false}/>
      <View style={styles.content}>
        {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        
        {/* Main content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.title}>Hospital Details</Text>
              {hospitalDetails && (
                <View style={styles.card}>
                 
                  <Text>{hospitalDetails.name}</Text>
                  <Text>Address: {hospitalDetails.address}</Text>
                  <Text>Phone : {hospitalDetails.contact}</Text>
                  <Text>Email : {hospitalDetails.email}</Text>
                </View>
              )}
              <Text style={styles.heading}>EMPLOYEE STATISTICS</Text>
              <View style={[styles.gridContainer, isSidebarOpen && styles.gridContainerWithSidebar]}>
                {Object.keys(counts).map((key, index) => (
                  <View key={index} style={[styles.card, isSidebarOpen && styles.smallCard]}>
                    <Text style={styles.title}>{key.charAt(0).toUpperCase() + key.slice(1)} Count</Text>
                    <Text style={styles.count}>{counts[key]}</Text>
                  </View>
                ))}
              </View>
            </>
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
    paddingTop: 50,
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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '45%', 
    marginHorizontal: '2.5%', 
  },
  smallCard: {
    width: '10%', 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  count: {
    fontSize: 24,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridContainerWithSidebar: {
    justifyContent: 'flex-start', // Adjust the alignment for the grid when the sidebar is open
  },
});

export default AdminHome;
