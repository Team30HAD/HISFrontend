import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};
// const ReceptionistSidebar = ({ navigation }) => {
//   const navigateToScreen = (route) => () => {
//     navigation.navigate(route);
//   };
const ReceptionistSidebar = ({ navigation}) => {
  const navigateToScreen = (route) => () => {
    if (route === 'Appointment') {
      navigation.navigate(route);
    } else if (route === 'EditPatientDetails') {
      navigation.navigate(route);
    } else if (route === 'HomePage') {
      clearAsyncStorage();
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToScreen('ReceptionistHome')}>
        <Text style={styles.item}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('Appointment')}>
        <Text style={styles.item}>Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('EditPatientDetails')}>
        <Text style={styles.item}>Edit Details</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToScreen('HomePage')}>
        <Text style={styles.item}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#669bed',
    width: 140,
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
    marginTop: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarClosed: {
    left: -200,
  },
});

export default ReceptionistSidebar;
