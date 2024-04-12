import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSideBar';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../config';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

const validateInputs = (test) => {
    if (!test.testName.trim()) {
        Alert.alert('Test Name is required.');
        return false;
    }
    if (!isNaN(test.testName) || /^\d+$/.test(test.testName)) {
        Alert.alert('Test Name should contain at least one character and not just numeric.');
        return false;
    }
    return true;
};

export default function EditTest({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const patientId = route.params.patientId;
    const testId = route.params.testId;
    const [test, setTest] = useState({
        testName: '',
    });

    useEffect(() => {
        fetchTestDetails();
    }, []);

    const fetchTestDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctor/getTest/${patientId}/${testId}`,{
            headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const fetchedTest = response.data;
            setTest({
                testName: fetchedTest.testName,
            });
        } catch (error) {
            console.error('Error fetching test details:', error);
        }
    };

    const handleChange = (key, value) => {
        setTest({ ...test, [key]: value });
    };

    const handleSubmit = async () => {
        try {
            if (!validateInputs(test)) {
                return;
            }
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${API_BASE_URL}/doctor/editTest/${patientId}/${testId}`, {
                ...test
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Alert.alert("Test Updated successfully");
            route.params.onViewTest();
            navigation.goBack();
        } catch (error) {
            console.error('Error updating test:', error);
        }
    };

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSidebar navigation={navigation} />}
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <View style={styles.formcontent}>
                        <Text style={styles.heading}>Edit Test</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Test Name:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleChange('testName', text)}
                                value={test.testName}
                                placeholder="Test Name"
                            />
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    formContainer: {
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        width: 360,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        borderRadius: 5,
        width: 200,
        marginBottom: 20,
    },
    submitButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    formcontent: {
        alignItems: 'center'
    },
});