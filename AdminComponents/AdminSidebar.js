import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminSidebar = () => {
  const navigation = useNavigation();

  const navigateToScreen = (route) => () => {
    if (route === 'Login') {
      AsyncStorage.clear()
        .then(() => {
          navigation.navigate(route);
        })
        .catch((error) => {
          console.error('Error clearing AsyncStorage:', error);
        });
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <TouchableOpacity onPress={navigateToScreen('AdminHome')}>
        <Text style={styles.item}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('AddEmployee')}>
        <Text style={styles.item}>Add Employee</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('RoleSelection')}>
        <Text style={styles.item}>Employee Details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('AddSpecialization')}>
        <Text style={styles.item}>Add Specialization</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('HomePage')}>
        <Text style={styles.item}>Logout</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#669bed',
    width: 140,
    alignItems:'center',
    justifyContent:'flex-start',
    paddingTop: 10,
    marginTop: -19,
    marginLeft: -30,
    paddingHorizontal: 20,
  },
  item: {
    fontSize: 20,
    marginBottom: 20,
    marginTop:60,
    fontWeight:'bold',
    color: '#fff',
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarClosed: {
    left: -200,
  },
});
export default AdminSidebar;
