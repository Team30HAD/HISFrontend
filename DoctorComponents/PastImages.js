import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PastImages = ({ route }) => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pastImages, setPastImages] = useState([]);

  const historyId = route.params.historyId;
  useEffect(() => {
    fetchPastImages();
  }, []);

  const fetchPastImages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/doctor/pastImages/${historyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPastImages(response.data);
    } catch (error) {
      console.error('Error fetching past images:', error);
    }
  };



  return (
    <View style={styles.container}>
      <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
      <View style={styles.content}>
        {isSidebarOpen && <DoctorSideBar />}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>Past Images</Text>
          <View style={styles.imageContainer}>
          {pastImages.length > 0 ? (
                pastImages.map((base64Image, index) => (
                    <View key={index} style={styles.imageItem}>
                    <Image
                        source={{ uri: base64Image.pastImg }}
                        style={styles.circularImage}
                    />
                    </View>
                ))
                ) : (
                <Text style={styles.noImagesText}>No images available</Text>
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
  noImagesText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'red', 
  }
  
});

export default PastImages;