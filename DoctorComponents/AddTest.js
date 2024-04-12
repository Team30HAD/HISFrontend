import React, { useState } from 'react';
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


export default function AddTest({ navigation, route }) {
    const patientId = route.params.patientId;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [test, setTest] = useState({
        testName: '',
    });

    const handleChange = (value) => {
        setTest({ testName: value });
    };

    const handleSubmit = async () => {
        try {
            if (!validateInputs(test)) {
                return;
            }
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/addTest/${patientId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(test)
            });
            if(response.ok){
            console.log('Test added successfully:', response.data);
            Alert.alert("Test Added successfully");
            setTest({ testName: '' });}
        } catch (error) {
            console.error('Error adding test:', error);
        }
    };

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSidebar navigation={navigation} />}
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <View style={styles.formcontent}>
                        <Text style={styles.heading}>Add Test</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Test Name:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleChange(text)}
                                value={test.testName}
                                placeholder="Test Name"
                            />
                        </View>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footerContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('DoctorPatientDashboard', { patientId: route.params.patientId })}>
                            <Text style={styles.footerText1}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            route.params.onViewTest();
                            navigation.goBack();
                        }}>
                            <Text style={styles.footerText2}>View</Text>
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
    footerText1: {
        textAlign: 'left',
        marginTop: 10,
        color: 'blue',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    footerText2: {
        textAlign: 'right',
        marginTop: 10,
        color: 'blue',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
