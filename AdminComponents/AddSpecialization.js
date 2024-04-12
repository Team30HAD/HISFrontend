import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { API_BASE_URL } from "../config";

const AddSpecialization = ({ navigation }) => {
  const [specialization, setSpecialization] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddSpecialization = async () => {
    const regex = /^[a-zA-Z\s]+$/;

    if (!specialization.trim() || !regex.test(specialization)) {
      Alert.alert("Error", "Please enter a valid specialization.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${API_BASE_URL}/admin/addSpecialization`,
        { specializationName: specialization },
        { headers }
      );

      if (response.status === 200) {
        const data = response.data.specializationName;
        Alert.alert("Success", `Specialization ${data} added successfully!`);
        setSpecialization("");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add specialization. Please try again.");
      }
    } catch (error) {
      console.error("Error adding specialization:", error);
      Alert.alert("Error", "Failed to add specialization. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <AdminHeader onPressMenu={toggleSidebar} />
      <View style={styles.content}>
        {isSidebarOpen && (
          <AdminSidebar navigation={navigation} isSidebarOpen={isSidebarOpen} />
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Add Specialization</Text>
          <TextInput
            value={specialization}
            onChangeText={(value) => setSpecialization(value)}
            placeholder="Enter specialization"
            style={styles.input}
          />
          <Button title="Add" onPress={handleAddSpecialization} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  scrollContainer: {
    marginTop: 100,
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddSpecialization;
