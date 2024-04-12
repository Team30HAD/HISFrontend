import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const ViewReceptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const fetchReceptionists = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token'); 
      const response = await axios.get(`${API_BASE_URL}/admin/viewReceptionists`,{
        headers : {
          Authorization: `Bearer ${token}`
        }
      });
      setReceptionists(response.data);
    } catch (error) {
      console.error('Error fetching receptionists:', error);
    }
  }, []);

  useEffect(() => {
    fetchReceptionists();
  }, [fetchReceptionists]);

  const handleEdit = async (receptionistId) => {
    try {
      await navigation.navigate('EditReceptionistScreen', { 
        receptionistId: receptionistId,
        onSaveSuccess: fetchReceptionists
      });
      setIsSidebarOpen(false); // Close sidebar after navigating
    } catch (error) {
      console.error('Error navigating to edit screen:', error);
    }
  };

  const handleDeactivate = async (receptionistId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/admin/deactivateReceptionist/${receptionistId}`,null,{
        headers : {
          Authorization: `Bearer ${token}`
        }
      });
      fetchReceptionists();
      setIsSidebarOpen(false); 
    } catch (error) {
      console.error('Error deactivating receptionist:', error);
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
              <Text style={[styles.heading, {width: Dimensions.get('window').width * 0.8}]}>View Receptionists</Text> 
              <View style={{flexDirection: 'row'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                  <View style={styles.tableHeader}> 
                    <Text style={styles.headerText}>S.No</Text> 
                    <Text style={styles.headerText}>Receptionist ID</Text> 
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={styles.headerText}>Contact</Text>
                    <Text style={styles.headerText}>Email</Text>
                    <Text style={styles.headerText}>Action</Text>
                  </View>
                  {receptionists && receptionists.map((receptionist, index) => (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.tableCell}>{index+1}</Text>
                      <Text style={styles.tableCell}>{receptionist.receptionistId}</Text>
                      <Text style={styles.tableCell}>{receptionist.name}</Text>
                      <Text style={styles.tableCell}>{receptionist.contact}</Text>
                      <Text style={styles.tableCell}>{receptionist.email}</Text>
                      <View style={styles.actionContainer}>
                        <TouchableOpacity onPress={() => handleEdit(receptionist.receptionistId)}>
                          <MaterialIcons name="edit" size={24} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeactivate(receptionist.receptionistId)}>
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

export default ViewReceptionists;
