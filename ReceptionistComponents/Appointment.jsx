import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import CheckBox from "expo-checkbox";
import axios from "axios";
import ReceptionistHeader from "./ReceptionistHeader";
import ReceptionistSidebar from "./Sidebar";
import SelectDropdown from "react-native-select-dropdown";
import { Picker } from "@react-native-picker/picker";
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import { useEmail } from "../Context/EmailContext";

export default function Appointment({ navigation }) {

  const { email } = useEmail();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointmentInfo, setAppointmentInfo] = useState({
    patientId: "",
    doctorId: "",
    isEmergency: false,
    //isNewPatient: false,
    category: "",
  });

  

  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
  });

  const clearFields = () => {
    setPatientInfo({
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      category: "",
      doctor: ""
    });
  }


  // options for dropdown
  const [category, setCategory] = useState("");
  //const [doctorID, setDoctorID] = useState([]);
  const [doctors, setDoctors] = useState([]); // State to store doctor IDs and names
  const [isNewPatient, setIsNewPatient] = useState(false);

 
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
        const data = {
          name: response.data?.patientName,
          // convert age from number to string value
          age: "" + response.data?.age,
          gender: response.data?.sex,
          contact: response.data?.contact,
          email: response.data?.email,
        };
        setPatientInfo(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleChangeAppointment = (key, value) => {
    setAppointmentInfo({ ...appointmentInfo, [key]: value });
  };

  const handleChangePatient = (key, value) => {
    setPatientInfo({ ...patientInfo, [key]: value });
  };

  const handleSearchPatient = async () => {
    fetchPatientDetails();
  };

  
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      console.log(token);

      await axios
        .get(`${API_BASE_URL}/receptionist/getAllSpecializations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setCategory(res.data))
        .catch((err) => console.log(err));
        console.log(category);
    } catch (error) {
      console.log(error);
    }
  };
  


  const fetchDoctors = async (category) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      const response = await axios.get(
        `${API_BASE_URL}/receptionist/getOutdoorDoctorsBySpecialization/${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const doctorData = response.data.doctors;
      const temp = [];
  
      doctorData.forEach((doctor) => {
        const doctorObj = {
          id: doctor.doctorId,
          name: doctor.name,
        };
        temp.push(doctorObj);
      });
  
      setDoctors(temp);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const handleSubmitAppointment = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
      
      console.log("Receptionist email:", email);
      // Validate compulsory fields if isEmergency is false
      if (!appointmentInfo.isEmergency) {
        if (patientInfo.name.trim() === "") {
          Alert.alert("Name Required", "Please enter patient's name.");
          return;
        }
        if (patientInfo.age.trim() === "") {
          Alert.alert("Age Required", "Please enter patient's age.");
          return;
        }
        if (patientInfo.contact.trim() === "") {
          Alert.alert("Contact Required", "Please enter patient's contact number.");
          return;
          
        }
        // Validate if category is selected
          if (appointmentInfo.category === "") {
            Alert.alert("Category Required", "Please select a category.");
            return;
          }
  
          // Validate if doctor is selected
          if (appointmentInfo.doctorId === "") {
            Alert.alert("Doctor Required", "Please select a doctor.");
            return;
          }
  
      }
      // Validate compulsory fields if isEmergency is true
      if (appointmentInfo.isEmergency) {
        if (patientInfo.name.trim() === "") {
          Alert.alert("Name Required", "Please enter patient's name.");
          return;
        }
       
        if (patientInfo.contact.trim() === "") {
          Alert.alert("Contact Required", "Please enter patient's contact number.");
          return;
          
        }
        // Validate if category is selected
          if (appointmentInfo.category === "") {
            Alert.alert("Category Required", "Please select a category.");
            return;
          }
  
          // Validate if doctor is selected
          if (appointmentInfo.doctorId === "") {
            Alert.alert("Doctor Required", "Please select a doctor.");
            return;
          }
  
      }
      
  
    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\-\'\s]+$/;
    const ageRegex = /^\d+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactRegex =/^\d{10}$/;
  
    // Validate patient info fields
    if (!nameRegex.test(patientInfo.name.trim())) {
      Alert.alert("Invalid Name", "Please enter a valid name.");
      return;
    }
    if (!contactRegex.test(patientInfo.contact.trim())) {
      Alert.alert("Invalid contact", "Please enter a valid contact number.");
      return;
    }
    if (!appointmentInfo.isEmergency && !ageRegex.test(patientInfo.age.trim())) {
      Alert.alert("Invalid Age", "Please enter a valid age.");
      return;
    }
    if (!appointmentInfo.isEmergency && patientInfo.email.trim() !== "" && !emailRegex.test(patientInfo.email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return;
    }
  
      const bodyData = {
        name: patientInfo.name,
        age: patientInfo.age,
        sex: patientInfo.gender,
        contact: patientInfo.contact,
        email: patientInfo.email,
        category: appointmentInfo.category,
        emergency: appointmentInfo.isEmergency,
        doctorId: appointmentInfo.doctorId,
      };
      console.log(bodyData);
      if (isNewPatient) {
        await axios
          .post(
            `${API_BASE_URL}/receptionist/bookAppointmentForNewPatient/${email}`,
            bodyData,{
              headers: {
                  Authorization: `Bearer ${token}`,
                },
          }
          )
          .then((res) => {
            console.log("Success:", res.data);
            Alert.alert("Appointment booked sucessfully");
            setAppointmentInfo({
              patientId: "",
              doctorId: "",
              isEmergency: false,
              //isNewPatient: false,
            });
            clearFields();
            setIsNewPatient(false);
          })
          .catch((err) => console.log(err));
      } else {
        await axios
          .post(
            `${API_BASE_URL}/receptionist/bookAppointmentForExistingPatient/${email}/${appointmentInfo.patientId}`,
            bodyData,{
              headers: {
                  Authorization: `Bearer ${token}`,
                },
          }
          )
          .then((res) => {
            console.log("Success:", res.data);
            Alert.alert("Appointment booked sucessfully");
            setAppointmentInfo({
              patientId: "",
              doctorId: "",
              isEmergency: false,
              //isNewPatient: false,
            });
            clearFields();
            setIsNewPatient(false);
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.error("Error in handling appointment:", error);
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
            email={email}
            isSidebarOpen={isSidebarOpen}
          />
        )}

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>Book Appointment</Text>
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Patient Appointment:</Text>
              <CheckBox
                disabled={false}
                value={isNewPatient}
                onValueChange={(newValue) => {
                  setIsNewPatient(newValue);
                  clearFields();
                  // Clear and disable Patient ID field when the checkbox is checked
                  if (newValue) {
                    handleChangeAppointment("patientId", ""); // Clear patient ID
                  }
                }}
              />
            </View>
          </>
          {!isNewPatient && category.length > 0 && (
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
          )}

          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patient Name:</Text>
              <TextInput
                style={styles.input}
                //editable={!appointmentInfo.isEmergency}
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
               // editable={!appointmentInfo.isEmergency}
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
                //editable={!appointmentInfo.isEmergency}
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
                <Picker.Item key="Select Gender" label="Select Gender" value={null} />
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
                //editable={!appointmentInfo.isEmergency}
                onChangeText={(text) => handleChangePatient("age", text)}
                value={patientInfo.age}
                placeholder="Patient's age"
              />
            </View>
          </>

           
          <>
          {category.length > 0 && (
            <>
              <Text style={styles.label}>Category:</Text>
              <Picker
                selectedValue={appointmentInfo.category}
                onValueChange={async (itemValue, itemIndex) => {
                  try {
                    setDoctors([]); // Clear previous list of doctors
                    setAppointmentInfo({
                      ...appointmentInfo,
                      category: itemValue,
                    });
                    await fetchDoctors(itemValue); // Fetch doctors based on selected category
                  } catch (error) {
                    console.error("Error selecting category:", error);
                  }
                }}>
                <Picker.Item key="Select Category" label="Select Category" value={null} />
                {category.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>

            </>
          )}
        </>

        <>
        {doctors.length > 0 && (
  <>
    <Text style={styles.label}>Doctor:</Text>
          <Picker
            selectedValue={appointmentInfo.doctorId}
            onValueChange={(itemValue, itemIndex) => {
              const selectedDoctorObj = doctors.find(
                (doctor) => doctor.id === itemValue // Check doctor.id instead of doctor.name
              );
              if (selectedDoctorObj) {
                setAppointmentInfo({
                  ...appointmentInfo,
                  doctorId: selectedDoctorObj.id,
                });
                console.log("Selected Doctor:", selectedDoctorObj);
              }
            }}>
            <Picker.Item key="SelectDoctor" label="Select Doctor" value={null} />
            {doctors.map((doctor) => (
              <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} /> // Use doctor.id as value
            ))}
          </Picker>
        </>
        )}

        </>




          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Emergency Appointment:</Text>
              <CheckBox
                disabled={false}
                value={appointmentInfo.isEmergency}
                onValueChange={(newValue) =>
                  setAppointmentInfo({
                    ...appointmentInfo,
                    isEmergency: newValue,
                  })
                }
              />
            </View>
          </>

          {appointmentInfo.isEmergency ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitAppointment}
            >
              <Text style={styles.submitButtonText}>
                Book Emergency Appointment
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitAppointment}
            >
              <Text style={styles.submitButtonText}>
                Book Appointment
              </Text>
            </TouchableOpacity>
          )}
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
});