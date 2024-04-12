import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Dimensions } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const ViewPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchPharmacies = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token'); 
      const response = await axios.get(`${API_BASE_URL}/admin/viewPharmacies`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  }, []);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  const handleEdit = (pharmacyId) => {
    navigation.navigate('EditPharmacyScreen', { pharmacyId: pharmacyId, onSaveSuccess: fetchPharmacies });

  };

  const handleDeactivate = async (pharmacyId) => {
    try {
      const token = await AsyncStorage.getItem('token'); 
      await axios.put(`${API_BASE_URL}/admin/deactivatePharmacy/${pharmacyId}`,null,{
        headers : {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPharmacies(); 
    } catch (error) {
      console.error('Error deactivating pharmacy:', error);
    }
  };

return (
  <View style={styles.container}>
    <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="RoleSelection"/>
    <View style={styles.content}>
      <View style={styles.innerContent}>
      {isSidebarOpen && <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />}
        <ScrollView horizontal={true}>
          <View style={styles.tableContainer}>
            <Text style={[styles.heading, {width: Dimensions.get('window').width * 0.8}]}>View Pharmacies</Text> 
            <View style={{flexDirection: 'row'}}>
              <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.tableHeader}> 
                  <Text style={styles.headerText}>S.No</Text> 
                  <Text style={styles.headerText}>Pharmacy ID</Text> 
                  <Text style={styles.headerText}>Name</Text>
                  <Text style={styles.headerText}>Contact</Text>
                  <Text style={styles.headerText}>Email</Text>
                  <Text style={styles.headerText}>License Number</Text>
                  <Text style={styles.headerText}>Action</Text>
                </View>
                {pharmacies && pharmacies.map((pharmacy, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={styles.tableCell}>{index+1}</Text>
                    <Text style={styles.tableCell}>{pharmacy.pharmacyId}</Text>
                    <Text style={styles.tableCell}>{pharmacy.name}</Text>
                    <Text style={styles.tableCell}>{pharmacy.contact}</Text>
                    <Text style={styles.tableCell}>{pharmacy.email}</Text>
                    <Text style={styles.tableCell}>{pharmacy.licenseNumber}</Text>
                    <View style={styles.actionContainer}>
                      <TouchableOpacity onPress={() => handleEdit(pharmacy.pharmacyId)}>
                        <MaterialIcons name="edit" size={24} color="blue" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeactivate(pharmacy.pharmacyId)}>
                        <MaterialIcons name="delete" size={24} color="red" />
                      </TouchableOpacity>
                    </View> 
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  
},
content: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 100,
    },
  scrollContainer: {
    flexGrow: 1,
          // alignItems: 'center',
    paddingTop: 100,
},
innerContent: {
  flex: 1,
  flexDirection: 'row',
},
heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    headerText: {
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    tableCell: {
      flex: 1,
      textAlign: 'center',
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 60,
    },
});

export default ViewPharmacies;
