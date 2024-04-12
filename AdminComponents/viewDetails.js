import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ViewReceptionists from './viewReceptionists';
import ViewPharmacies from './viewPharmacies';
import ViewDoctors from './viewDoctors';
import ViewNurses from './viewNurses';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { API_BASE_URL } from '../config';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  let viewComponent = null;

  switch (selectedRole) {
    case 'receptionist':
      viewComponent = <ViewReceptionists />;
      break;
    case 'pharmacy':
      viewComponent = <ViewPharmacies />;
      break;
    case 'doctor':
      viewComponent = <ViewDoctors />;
      break;
    case 'nurse':
      viewComponent = <ViewNurses />;
      break;
    default:
      viewComponent = (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Select Role</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('doctor')}>
            <Text style={styles.buttonText}>Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('receptionist')}>
            <Text style={styles.buttonText}>Receptionist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('pharmacy')}>
            <Text style={styles.buttonText}>Pharmacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelect('nurse')}>
            <Text style={styles.buttonText}>Nurse</Text>
          </TouchableOpacity>
        </ScrollView>
      );
  }

  return (
    <View style={styles.container}>
      <AdminHeader onPressMenu={toggleSidebar} showBackButton={true} backButtonDestination="AdminHome"/>
      <View style={styles.content}>
        {isSidebarOpen && <AdminSidebar isSidebarOpen={isSidebarOpen} />}
        {viewComponent}
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
        scrollContainer: {
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 20,
          },
        heading: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        button: {
            backgroundColor: 'blue',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
        },
        buttonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

export default RoleSelection;
