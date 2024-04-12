import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEmail} from '../Context/EmailContext';
import { API_BASE_URL } from '../config';


const ReceptionistLogin= ({ navigation }) => {
  const { updateEmail } = useEmail();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async() => {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
            style={[styles.backButton, { width: 100, backgroundColor: 'green' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '50%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'blue',
    width: '20%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ReceptionistLogin;
