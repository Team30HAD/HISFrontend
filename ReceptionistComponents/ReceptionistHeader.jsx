import React from "react";
import { View,Text,StyleSheet,TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const ReceptionistHeader=({onPress})=>{
    return(
        <View style={styles.header}>
            <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
                <Ionicons name="menu-outline" size={24} color="white" />
             </TouchableOpacity>
            <Text style={styles.title}>Welcome</Text>
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
        marginLeft: 110,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff', 
    },
    iconContainer: {
        marginRight: 10,
      },
  });

export default ReceptionistHeader;