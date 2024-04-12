import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,route,
  ImageBackground, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEmail} from './Context/EmailContext';
import { API_BASE_URL } from './config';
import LogoImage from "./Nurse_Comp_Images/Logo.jpg";
import LoginPage from "./Nurse_Comp_Images/LoginPage.jpg";

const Login= ({ navigation,route }) => {
  const { updateEmail } = useEmail();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const roles=route.params.role;
  //console.log(roles);
  
  const handleLogin = async() => {
    //console.log(role);
    if(roles=== 'Nurse'){
    try {
        const response = await axios.post(`${API_BASE_URL}/nurse/login`, {
          email,
          password,
        });
        console.log(response.data.status);
        if (response.data.status) {
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('NurseHome');
        } else {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
      } else if (error.request) {
          console.error('No Response from Server:', error.request);
      } else {
          console.error('Request Error:', error.message);
      }
      
      }
    }
    if(roles=='Doctor'){
      try {
        const response = await axios.post(`${API_BASE_URL}/doctor/login`, {
          email,
          password,
        });
        console.log(response.data.status);
        if (response.data.status) {
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('DoctorHome', { shouldFetchData: true });
        } else {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
      } else if (error.request) {
          console.error('No Response from Server:', error.request);
      } else {
          console.error('Request Error:', error.message);
      }
      
      }
    }
    if(roles=='Admin'){
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/login`, {
          email,
          password,
        });
        console.log(response.data.status);
        if (response.data.status) {
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('AdminHome');
        } else {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
      } else if (error.request) {
          console.error('No Response from Server:', error.request);
      } else {
          console.error('Request Error:', error.message);
      }
      
      }
    }
    if(roles==='Receptionist')
    {
      try {
        const response = await axios.post(`${API_BASE_URL}/receptionist/login`, {
          email,
          password,
        });
        console.log(response.data.status);
        if (response.data.status) {
          //const ReceptionistId = response.data.email;
          updateEmail(email); 
          const token = response.data.token;
          await AsyncStorage.setItem('token', token);
          navigation.navigate('Appointment');
        } else {
          Alert.alert(
          'Error',
          'Invalid email or password',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
        }
          
          // updateReceptionistId(email); 
          // navigation.navigate('Appointment');

      } catch (error) {
          /*console.error('Error logging in:', error);
          setError('Error logging in. Please try again later.');*/
          if (error.response) {
            // Server responded with a non-2xx status code
            console.error('Server Error:', error.response.data);
        } else if (error.request) {
            // No response received from the server
            console.error('No Response from Server:', error.request);
        } else {
            // Request failed to be sent
            console.error('Request Error:', error.message);
        }
        
     }
    }
    if(roles
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      ==='Pharmacy')
    {
      try {
        const response = await axios.post(`${API_BASE_URL}/pharmacy/login`, {
          email,
          password,
        });
        console.log(response.data.status);
        if (response.data.status) {
          updateEmail(email);
          const token = response.data.token;
          await AsyncStorage.setItem('pharmacytoken', token);
          navigation.navigate('PharmacyHome'); 
        } else {
          Alert.alert(
            'Error',
            'Invalid email or password',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') }
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error('Server Error:', error.response.data);
        } else if (error.request) {
          console.error('No Response from Server:', error.request);
        } else {
          console.error('Request Error:', error.message);
        }
        Alert.alert('Error', 'Failed to log in. Please try again.'); 
      }
    }
  };


return (
    <View style={styles.container}>
      <View style={styles.background}>
        <ImageBackground
          source={{
            uri: "https://st3.depositphotos.com/1832477/17001/v/450/depositphotos_170013084-stock-illustration-vector-flat-doctor-nurse-surgeon.jpg",
          }}
          style={styles.backgroundImage}
        >
          {/* Your existing content inside the ImageBackground */}

          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Image source={LogoImage} style={styles.logo} />
            </View>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputContainer}>
            <Text style={styles.requiredText}>Enter your Email ID:
  <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
             </View>
            <View style={styles.inputContainer}>
              
              <Text style={styles.requiredText}>Enter your Password: 
  <Text style={styles.asterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            /></View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "lightblue", // Background color for the screen
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ensure the image covers the entire screen
    justifyContent: "center",
    alignItems: "center",
    //zIndex: 0, // Set a lower zIndex for the background image
    //pointerEvents: 'auto', // Enable touch interactions
  },
  logoContainer: {
    flexDirection: "row", // Align the logo and buttons in a row
    alignItems: "center",
    marginBottom: 80, // Add margin between the logo and buttons
    marginTop: -60,
  },
  logo: {
    width: 280, // Adjusted width to make it smaller
    height: 100, // Adjusted height to make it smaller
    marginTop: 10,
    marginBottom: -10,
    borderRadius: 5, // Half of the width and height to make it circular
    borderWidth: 1, // Adjust border width as needed
    borderColor: "teal", // Border color
    overflow: "hidden", // Clip the content inside the border
    shadowColor: "black", // Shadow color
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8, // Adjust shadow opacity as needed
    shadowRadius: 10, // Adjust shadow radius as needed
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: -10,
    marginTop: 20,
    color: "#339999",
  },
  inputContainer: {
    //flexDirection: "row",
    marginTop: 30,
    //alignItems: "center",
  },
  requiredText: {
    color: "#1e6666", // Set the color of "Enter your Email" to black
    marginRight: 5,
    marginLeft: 10,
    marginTop: 10,
  },
  asterisk: {
    color: "red", // Set the color of "*" to red
  },
  input: {
    width: 400,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 0,
    backgroundColor: "rgba(51, 153, 153, 0.1)",
    marginLeft: 10, // Adjust marginLeft to shift input boxes to the right
  },
  button: {
    backgroundColor: "#339999",
    width: 200,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  backButton: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: 'goldenrod',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default Login;
