import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SymptomsImages = ({ route }) => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [symptomImages, setSymptomImages] = useState([]);

  const patientId = route.params.patientId;
  useEffect(() => {
    fetchSymptomsImages();
  }, []);

  const fetchSymptomsImages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/doctor/symptomImages/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSymptomImages(response.data);
    } catch (error) {
      console.error('Error fetching symptom images:', error);
    }
  };


  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.content}>
        {isSidebarOpen && <DoctorSideBar />}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>Symptoms Images</Text>
          <View style={styles.imageContainer}>
            {symptomImages && symptomImages.length > 0 ? (
                symptomImages.map((image, index) => (
                <View key={index} style={styles.imageItem}>
                    <Image
                    source={{ uri: image.image }}
                    style={styles.circularImage}
                    />
                    <Text style={styles.imageDescription}>{image.description}</Text>
                </View>
                ))
            ) : (
                <Text style={styles.noImagesText}>No symptom images available</Text>
            )}
            </View>


          <TouchableOpacity
            style={[styles.backButton, { width: 100, backgroundColor: 'green' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageItem: {
    margin: 8,
  },
  circularImage: {
    width: 200,
    height: 200,
    borderRadius: 100, 
  },
  backButton: {
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
  imageDescription: {
    textAlign: 'center',
    marginTop: 5,
  },
  noImagesText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'red', 
  }
  
});

export default SymptomsImages;