import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import DoctorSideBar from './DoctorSideBar';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecordProgress({ navigation, route }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [progress, setProgress] = useState({
        status: '',
    });
    const [showProgressTable, setShowProgressTable] = useState(false);
    const [progressHistory, setProgressHistory] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(true);
    const [viewingProgress, setViewingProgress] = useState(false); // Indicates if currently viewing progress or not

    const handleSave = async (selectedStatus) => {
        setProgress({ ...progress, status: selectedStatus }); 
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/recordProgress/${patientId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(progress)
            });
            if(response.ok){
                Alert.alert("Progress saved successfully");
                setProgress({ status: null });
                handleViewProgress();
                setShowProgressTable(true);
                setShowCheckboxes(false); // Hide checkboxes after recording progress
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const handleViewProgress = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/doctor/progressHistory/${patientId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if(response.ok){
                const data = await response.json();
                setProgressHistory(data);
                setShowProgressTable(true);
                setShowCheckboxes(false);
                setViewingProgress(true); // Set the flag to indicate currently viewing progress
            }
        } catch (error) {
            console.error('Error fetching progress history:', error);
        }
    };

    const toggleProgressView = () => {
        if (viewingProgress) {
            setShowProgressTable(false);
            setShowCheckboxes(true);
            setViewingProgress(false);
        } else {
            handleViewProgress();
        }
    };

    const patientId = route.params.patientId;
    const patientDetails = route.params.patientDetails;

    return (
        <View style={styles.container}>
            <DoctorHeader onPress={() => setIsSidebarOpen(!isSidebarOpen)} />
            <View style={styles.content}>
                {isSidebarOpen && <DoctorSideBar navigation={navigation} />}
                <ScrollView contentContainerStyle={styles.scrollView}>
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
                            </View>
                        )}
                    </View>

                    {showProgressTable && (
                        <View>
                            <Text style={styles.heading}>{viewingProgress ? 'Progress History' : 'Record Progress'}</Text>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.headerText}>S.No</Text>
                                    <Text style={styles.headerText}>Date of Record</Text>
                                    <Text style={styles.headerText}>Time of Record</Text>
                                    <Text style={styles.headerText}>Status</Text>
                                </View>
                                {progressHistory&&progressHistory.map((progress, index) => (
                                    <View style={styles.tableRow} key={progress.Id}>
                                        <Text style={styles.tableCell}>{index + 1}</Text>
                                        <Text style={styles.tableCell}>{progress.date}</Text>
                                        <Text style={styles.tableCell}>{progress.time}</Text>
                                        <Text style={styles.tableCell}>{progress.status}</Text>
                                    </View>
                                ))}
                            </View>
                            {!viewingProgress && (
                                <TouchableOpacity
                                    style={styles.ButtonContainer}
                                    onPress={() => {
                                        setShowProgressTable(false);
                                        setShowCheckboxes(true);
                                        setViewingProgress(false); // Reset the viewing progress state
                                    }}
                                >
                                    <Text style={styles.ButtonText}>Record Progress</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {!showProgressTable && !viewingProgress && showCheckboxes && (
                        <View style={styles.progressContainer}>
                            <Text style={styles.heading}>Progress</Text>
                            <Text style={styles.currentStatus}>Current Status:</Text>
                            <View style={styles.checkboxContainer}>
                                <CheckBox
                                    title="Declined"
                                    checked={progress.status === 'Declined'}
                                    onPress={() => setProgress({ ...progress, status: 'Declined' })}
                                />
                                <CheckBox
                                    title="Stable"
                                    checked={progress.status === 'Stable'}
                                    onPress={() => setProgress({ ...progress, status: 'Stable' })}
                                />
                                <CheckBox
                                    title="Improved"
                                    checked={progress.status === 'Improved'}
                                    onPress={() => setProgress({ ...progress, status: 'Improved' })}
                                />
                                <TouchableOpacity
                                    style={styles.ButtonContainer}
                                    onPress={() => handleSave(progress.status)}
                                >
                                    <Text style={styles.ButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={toggleProgressView}
                    >
                        <Text style={styles.Text1}>{viewingProgress ? 'Record Progress' : 'View Progress'}</Text>     
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.backButton, { width: 100, backgroundColor: 'green' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.ButtonText}>Back</Text>
                    </TouchableOpacity>
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
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
    detailsContainer: {
        flex: 1,
        marginRight: 10,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: 5,
        color: '#555',
    },
    detailValue: {
        flex: 1,
        color: '#333',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    patientDetailsContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    progressContainer: {
        marginBottom: 20,
    },
    currentStatus: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 20,
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
    },
    ButtonContainer: {
        backgroundColor: 'green',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        width: 80,
        marginRight: 20,
        marginBottom: 20,
    },
    ButtonText: {
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold', 
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },

    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    headerText: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    Text1: {
        textAlign: 'left',
        marginTop: 10,
        color: 'blue',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});
