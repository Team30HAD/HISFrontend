
import { StyleSheet, Text, View, TouchableOpacity,ScrollView,Image, Card,Alert,Picker} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import {useEmail} from '../Context/EmailContext';
import NurseHeader from './NurseHeader';
import NurseSidebar from './Sidebar';

import { API_BASE_URL } from '../config';
import VitalsImage from "../Nurse_Comp_Images/Add_Vitals.png";
import SymptomsImage from "../Nurse_Comp_Images/Add_Symptoms.png";
import SymptomsImagesImage from "../Nurse_Comp_Images/Add_Symptoms_Images.png";
import PastHistoryImage from "../Nurse_Comp_Images/Add_Past_History.png";
import TestResultsImage from "../Nurse_Comp_Images/Add_Test_Results.png";
import Patient_Dashboard from "../Nurse_Comp_Images/Patient_Dashboard.gif";

export default function NursePatient_Dashboard({ navigation, route }) {
    const { email } = useEmail();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);
    const patientId=route.params.patientId
    const handleaddVitals=()=>{
      navigation.navigate("AddVitals",{patientId})
    }
    const handleaddSymptoms=()=>{
      navigation.navigate("AddSymptoms",{patientId})
    }
    const handleaddPastHistory=()=>{
      navigation.navigate("AddPastHistory",{patientId})
    }
    const handleaddSymptomImages=()=>{
      navigation.navigate("AddSymptomImages",{patientId})
    }
    const handleaddTestResult=()=>{
      navigation.navigate("AddTestResult",{patientId})
    }
  
    useEffect(() => {
      const fetchPatientDetails = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get(`${API_BASE_URL}/nurse/getPatientDetailsById/${route.params.patientId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPatientDetails(response.data);
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      };
  
      fetchPatientDetails();
    }, [route.params.patientId]);
  
  
    
  
    return (
      <View style={styles.container}>
        <NurseHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
        <View style={styles.content}>
        {isSidebarOpen && <NurseSidebar navigation={navigation} email={email} isSidebarOpen={isSidebarOpen} activeRoute="NursePatient_Details"/>}
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.patientDetailsContainer}>
            <Text style={styles.heading}>Patient Details</Text>
            {patientDetails && (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Patient ID:</Text>
                  <Text style={styles.detailValue}>{patientDetails.patientId}</Text>
               
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{patientDetails.patientName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Age:</Text>
                  <Text style={styles.detailValue}>{patientDetails.age}</Text>
                
                  <Text style={styles.detailLabel}>Sex:</Text>
                  <Text style={styles.detailValue}>{patientDetails.sex}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Contact:</Text>
                  <Text style={styles.detailValue}>{patientDetails.contact}</Text>
                
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{patientDetails.email}</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.actionContainer}>
          
  <TouchableOpacity style={styles.addButtonContainer} onPress={handleaddVitals}>
    <Image source={VitalsImage} style={styles.addButtonIcon} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.addButtonContainer} onPress={handleaddSymptoms}>
    <Image source={SymptomsImage} style={styles.addButtonIcon} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.addButtonContainer} onPress={handleaddSymptomImages}>
    <Image source={SymptomsImagesImage} style={styles.addButtonIcon} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.addButtonContainer} onPress={handleaddPastHistory}>
    <Image source={PastHistoryImage} style={styles.addButtonIcon} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.addButtonContainer} onPress={handleaddTestResult}>
    <Image source={TestResultsImage} style={styles.addButtonIcon} />
  </TouchableOpacity>
</View>
<Image source={Patient_Dashboard} style={styles.Icon} />
          </ScrollView>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //position: 'absolute',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    patientDetailsContainer: {
      marginBottom: 10,
  },
  detailsContainer: {
      marginTop: 10,
      borderWidth: 1,
        borderColor: '#339999',
        borderRadius: 4,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 3 },
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // elevation: 1,
        marginLeft: 25,
        marginRight: 25,
        marginTop: 10,
        backgroundColor: '#e6fafa',
        padding: 10,
  },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 5,
        //borderBottomWidth: 1,
        //borderBottomColor: '#339999', // Adjust the color as needed
    },
    heading: {
      fontSize: 30, // Increase font size for emphasis
      fontWeight: 'bold', // Make the text bold
      color: 'teal', // Change text color to a darker shade
      marginTop: 10, // Increase bottom margin for spacing
      marginBottom: 5, // Increase bottom margin for spacing
      textAlign: 'center', // Center-align the text
      //textTransform: 'uppercase', // Convert text to uppercase for emphasis
      //textDecorationLine: 'underline',
    },
    detailLabel: {
        fontWeight: 'bold',
        width: '15%',
        color: '#333',
        fontSize: 18, // Example font size
    },
    detailValue: {
      fontWeight: 'bold',
        width: '20%',
        color: '#666',
        fontSize: 16, // Example font size
    },
    actionContainer: {
        marginTop: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        //flexWrap: 'wrap',
        //justifyContent: 'space-around',
    },
    addButtonContainer: {
        marginBottom: 20,
        alignItems: 'center',
        width: '15%', // Adjust the width as needed
        //height: 80, // Adjust the height as needed
        aspectRatio: 1, // Maintain aspect ratio to make the images square
        borderRadius: 8, // Rounded corners to make it look like a button
        backgroundColor: '#99ccdd', // Background color to make it look like a button
        borderColor: '#339999', // Border color
        borderWidth: 2, // Border width
        justifyContent: 'center', // Center the image
        alignItems: 'center',
    },
    addButtonIcon: {
        //width: 70, // Adjust the width as needed
        height: 150, // Adjust the height as needed
        alignSelf: 'center', // Align the icon to the center
        //width: '80%', // Adjust the width to occupy 80% of the container width
        aspectRatio: 1, // Maintain aspect ratio
        borderRadius: 8, 
    },
    Icon: {
      //width: 70, // Adjust the width as needed
      height: 260, // Adjust the height as needed
      alignSelf: 'center', // Align the icon to the center
      //width: '80%', // Adjust the width to occupy 80% of the container width
      aspectRatio: 1, // Maintain aspect ratio
      borderRadius: 8, 
  },
});
 