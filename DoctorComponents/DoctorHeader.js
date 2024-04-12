import React from "react";
import { View,Text,StyleSheet,TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const DoctorHeader=({onPress})=>{
  return(
    <View style={styles.header}>
        <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
            <Ionicons name="menu-outline" size={40} color="white" fontWeight="bold"/>
         </TouchableOpacity>
        <Text style={styles.title}>Welcome Doctor</Text>
    </View>
);
}
const styles = StyleSheet.create({
    header: {
    backgroundColor: '#669bed', 
    padding: 15,
    flexDirection:'row',
    alignItems:'center',
    width:'100%' ,
    },
    title: {
      marginLeft: 200,
      fontSize: 40,
      alignContent: 'center',
      fontWeight: 'bold',
      color: '#fff', 
    },
    iconContainer: {
        marginRight: 10,
      },
  });

export default DoctorHeader;