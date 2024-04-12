import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  //Picker
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import CheckBox from "expo-checkbox";
import axios from "axios";
import ReceptionistHeader from "./ReceptionistHeader";
import ReceptionistSidebar from "./Sidebar";
import SelectDropdown from "react-native-select-dropdown";
import { Picker } from "@react-native-picker/picker";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import { useEmail } from "../Context/EmailContext";

export default function EditPatientDetails({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { email } = useEmail();
  const [appointmentInfo, setAppointmentInfo] = useState({
    patientId: "",
  });
  const [fetchedData, setFetchedData] = useState()
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    department:"OP"
  });

  const clearFields = () => {
    setPatientInfo({
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      department:"OP"
    });
  };
  // Regular expressions for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const ageRegex = /^\d+$/;
  const contactRegex = /^\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


  const validateFields = () => {
    if (!appointmentInfo.patientId.trim()) {
      Alert.alert("Patient ID Required", "Please enter patient's ID.");
      return false;
    }
    if (!patientInfo.name.trim()) {
      Alert.alert("Name Required", "Please enter patient's name.");
      return false;
    }
    if (!nameRegex.test(patientInfo.name.trim())) {
      Alert.alert("Invalid Name", "Please enter a valid name.");
      return false;
    }
    if (!ageRegex.test(patientInfo.age.trim())) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return false;
    }
    if (!patientInfo.contact.trim()) {
      Alert.alert("Contact Required", "Please enter patient's contact number.");
      return false;
    }
    if (!contactRegex.test(patientInfo.contact.trim())) {
      Alert.alert("Invalid Contact", "Please enter a valid contact number.");
      return false;
    }
    // Validate gender selection
    if (!patientInfo.gender) {
      Alert.alert("Gender Required", "Please select patient's gender.");
      return false;
    }
    // Validate email if entered
    if (patientInfo.email.trim() && !emailRegex.test(patientInfo.email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return false;
    }
    return true;
  };
  


  const fetchPatientDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getPatientDetails/${appointmentInfo.patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.patientName === undefined) {
        clearFields();
      } else {
        console.log(response.data);
        setFetchedData(response.data);
        const data = {
          name: response.data?.patientName,
          age: "" + response.data?.age,
          gender: response.data?.sex,
          contact: response.data?.contact,
          email: response.data?.email,
          department:"OP"
        };
        setPatientInfo(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleChangePatient = (key, value) => {
    setPatientInfo({ ...patientInfo, [key]: value });
  };

  const handleChangeAppointment = (key, value) => {
    setAppointmentInfo({ ...appointmentInfo, [key]: value });
  };


  const handleSearchPatient = async () => {
    fetchPatientDetails();
  };
  
  const handleDeletePatient = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      await axios.put(
        `${API_BASE_URL}/receptionist/deletePatientPII/${appointmentInfo.patientId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Patient details deleted successfully");
      Alert.alert("Patient details deleted successfully");
      setAppointmentInfo({
        patientId: "",
      });
      clearFields();
    } catch (error) {
      console.error("Error deleting patient details:", error);
    }
  };
  

  
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      const bodyData = {
        //...fetchedData,
        patientName: patientInfo.name,
        age: patientInfo.age,
        sex: patientInfo.gender,
        contact: patientInfo.contact,
        email: patientInfo.email,
        department:patientInfo.department
      };
      console.log(bodyData);
  
      if (!validateFields()) {
        return;
      }
  
      await axios.put(
        `${API_BASE_URL}/receptionist/updatePatient/${appointmentInfo.patientId}`,
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Patient details updated successfully");
      Alert.alert("Patient details updated successfully");
      setAppointmentInfo({
        patientId: "",
      });
      clearFields();
    } catch (error) {
      console.error("Error updating patient details:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* <ReceptionistHeader /> */}
      {/* <ReceptionistSidebar navigation={navigation} /> */}
      <ReceptionistHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />

      <View style={styles.content}>
        {isSidebarOpen && (
          <ReceptionistSidebar
            navigation={navigation}
            //receptionistId={receptionistId}
            email={email}
            isSidebarOpen={isSidebarOpen}
          />
        )}

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>Update Patient</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient ID:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                handleChangeAppointment("patientId", text)
              }
              value={appointmentInfo.patientId}
              placeholder="Enter patient's ID"
            />
            <TouchableOpacity onPress={handleSearchPatient}>
              <Text>Search</Text>
            </TouchableOpacity>
          </View>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("name", text)}
                value={patientInfo.name}
                placeholder="Patient's Name"
              />
            </View>
          </>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Contact:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("contact", text)}
                value={patientInfo.contact}
                placeholder="Patient's contact"
              />
            </View>
          </>
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient email:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("email", text)}
                value={patientInfo.email}
                placeholder="Patient's email"
              />
            </View>
          </>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Gender:</Text>
              <Picker
                style={styles.input}
                selectedValue={patientInfo.gender}
                onValueChange={(itemValue, itemIndex) =>
                  handleChangePatient("gender", itemValue)
                }
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </>

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient age:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChangePatient("age", text)}
                value={patientInfo.age}
                placeholder="Patient's age"
              />
            </View>
          </>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePatient}
          >
            <Text style={styles.deleteButtonText}>
              Delete Patient
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    //width: "50vw",
    //justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row",
  },
  formContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  submitButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 15,
    borderRadius: 5,
    width: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  deleteButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
