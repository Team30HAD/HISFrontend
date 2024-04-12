import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "../config";

const AdminHeader = ({ onPressMenu, showBackButton, backButtonDestination }) => {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    if (showBackButton && backButtonDestination) {
      navigation.navigate(backButtonDestination);
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBackButtonPress} style={styles.iconContainer}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onPressMenu} style={styles.iconContainer}>
        <Ionicons name="menu-outline" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Welcome</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#669bed',
    padding: 20,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 999, 
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10, 
  },
  iconContainer: {
    marginRight: 10, 
  },
});

export default AdminHeader;
