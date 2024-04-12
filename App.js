import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorHome from './DoctorComponents/DoctorHome';
import DoctorPatientDashboard from './DoctorComponents/DoctorPatientDashboard';
import DoctorPatientDetails from './DoctorComponents/DoctorPatientDetails';
import AddMedications from './DoctorComponents/AddMedication';
import ViewMedications from './DoctorComponents/ViewMedications';
import EditMedication from './DoctorComponents/EditMedication';
import ViewTests from './DoctorComponents/ViewTests';
import AddTest from './DoctorComponents/AddTest';
import EditTest from './DoctorComponents/EditTest';
import PastHistory from './DoctorComponents/PastHistory';
import TestImages from './DoctorComponents/TestImages';
import SymptomsImages from './DoctorComponents/SymptomsImages';
import PastImages from './DoctorComponents/PastImages';
import RecommendIP from './DoctorComponents/RecommendIP';
import Appointment from './ReceptionistComponents/Appointment';
import EditPatientDetails from './ReceptionistComponents/EditPatientDetails';
import AddEmployee from './AdminComponents/addEmployee';
import AddSpecialization from './AdminComponents/AddSpecialization';
import RoleSelection from './AdminComponents/viewDetails';
import EditPharmacyScreen from './AdminComponents/editPharmacy';
import EditReceptionistScreen from './AdminComponents/editReceptionist';
import EditDoctorScreen from './AdminComponents/editDoctor';
import ViewDoctors from './AdminComponents/viewDoctors';
import EditNurseScreen from './AdminComponents/editNurse';
import ViewNurses from './AdminComponents/viewNurses';
import ViewReceptionists from './AdminComponents/viewReceptionists';
import ViewPharmacies from './AdminComponents/viewPharmacies';
import AdminHome from './AdminComponents/adminDashboard';
import PharmacyLogin from './PharmacyComponents/PharamcyLogin';
import PharmacyDetails from './PharmacyComponents/PharamcyHome';
import ViewMedication from './PharmacyComponents/ViewMedication';
import AddVitals from './NurseComponents/AddVitals';
import ViewVitals from './NurseComponents/ViewVitals';
import EditVitals from './NurseComponents/ EditVitals';
import AddSymptoms from './NurseComponents/AddSymptoms';
import ViewSymptoms from './NurseComponents/ViewSymptoms';
import EditSymptoms from './NurseComponents/EditSymptoms';
// import NurseLogin from './NurseComponents/NurseLogin';
import NurseHome from './NurseComponents/NurseHome';
import NursePatient_Details from './NurseComponents/NursePatient_Details';
import NursePatient_Dashboard from './NurseComponents/NursePatient_Dashboard';
import AddPastHistory from './NurseComponents/AddPastHistory';
import ViewPastHistory from './NurseComponents/ViewPastHistory';
import EditPastHistory from './NurseComponents/EditPastHistory';
import AddSymptomimage from './NurseComponents/AddSymptomImage';
import ViewSymptomImage from './NurseComponents/ViewSymptomImage';
import EditSymptomImage from './NurseComponents/EditSymptomImage';
import AddPastImage from './NurseComponents/AddPastImage';
import ViewPastImage from './NurseComponents/ViewPastImage';
import EditPastImage from './NurseComponents/EditPastImage';
import AddTestResult from './NurseComponents/AddTestResult';
import ViewTest from './NurseComponents/ViewTest';
import NurseEditTest from './NurseComponents/NurseEditTest';
import AddTestImage from './NurseComponents/AddTestImage';
import ViewTestImage from './NurseComponents/ViewTestImage';
import EditTestImage from './NurseComponents/EditTestImage';
import HomePage from './Home';
import {EmailProvider} from './Context/EmailContext';
import Login from './Login';
import { LogBox } from 'react-native';



const App = () => {
  const Stack = createStackNavigator();
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer>
      <EmailProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomePage">
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="Login" component={Login}/>
         {/* <Stack.Screen name="DoctorLogin" component={DoctorLogin} /> */}
          <Stack.Screen name="DoctorHome" component={DoctorHome} />
          <Stack.Screen name="DoctorPatientDashboard" component={DoctorPatientDashboard} />
          <Stack.Screen name="DoctorPatientDetails" component={DoctorPatientDetails} />
          <Stack.Screen name="AddMedications" component={AddMedications} />
          <Stack.Screen name="ViewMedications" component={ViewMedications} />
          <Stack.Screen name="EditMedication" component={EditMedication} />
          <Stack.Screen name="AddTest" component={AddTest} />
          <Stack.Screen name="ViewTests" component={ViewTests} />
          <Stack.Screen name="EditTest" component={EditTest} />
          <Stack.Screen name="PastHistory" component={PastHistory} />
          <Stack.Screen name="TestImages" component={TestImages} />
          <Stack.Screen name="SymptomsImages" component={SymptomsImages} />
          <Stack.Screen name="PastImages" component={PastImages} />
          <Stack.Screen name="RecommendIP" component={RecommendIP} />
          {/* <Stack.Screen name="ReceptionistLogin" component={ReceptionistLogin} /> */}
          <Stack.Screen name="Appointment" component={Appointment} />
          <Stack.Screen name="EditPatientDetails" component={EditPatientDetails} />
          {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
          <Stack.Screen name="AdminHome" component={AdminHome} /> 
          <Stack.Screen name="AddEmployee" component={AddEmployee} />
          <Stack.Screen name="AddSpecialization" component={AddSpecialization} />
          <Stack.Screen name="RoleSelection" component={RoleSelection} />
          <Stack.Screen name="ViewDoctors" component={ViewDoctors} />
          <Stack.Screen name="EditDoctorScreen" component={EditDoctorScreen} />
          <Stack.Screen name="ViewNurses" component={ViewNurses} />
          <Stack.Screen name="EditNurseScreen" component={EditNurseScreen} />
          <Stack.Screen name="ViewReceptionists" component={ViewReceptionists} />
          <Stack.Screen name="EditReceptionistScreen" component={EditReceptionistScreen} />
          <Stack.Screen name="ViewPharmacies" component={ViewPharmacies} />
          <Stack.Screen name="EditPharmacyScreen" component={EditPharmacyScreen} />
          {/* <Stack.Screen name="PharmacyLogin" component={PharmacyLogin} /> */}
          <Stack.Screen name="PharmacyHome" component={PharmacyDetails} />
          <Stack.Screen name="PharmacyPatient_Details" component={ViewMedication} />
          {/* <Stack.Screen name="NurseLogin" component={NurseLogin} /> */}
          <Stack.Screen name="NurseHome" component={NurseHome} />
          <Stack.Screen name="NursePatient_Details" component={NursePatient_Details} />
          <Stack.Screen name="NursePatient_Dashboard" component={NursePatient_Dashboard} />
          <Stack.Screen name="AddVitals" component={AddVitals} />
          <Stack.Screen name="viewVitals" component={ViewVitals} />
          <Stack.Screen name="EditVitals" component={EditVitals} />
          <Stack.Screen name="AddSymptoms" component={AddSymptoms} />
          <Stack.Screen name="viewSymptoms" component={ViewSymptoms} />
          <Stack.Screen name="EditSymptoms" component={EditSymptoms} />
          <Stack.Screen name="AddPastHistory" component={AddPastHistory} />
          <Stack.Screen name="viewPastHistory" component={ViewPastHistory} />
          <Stack.Screen name="EditPastHistory" component={EditPastHistory} />
          <Stack.Screen name="AddSymptomImages" component={AddSymptomimage} />
          <Stack.Screen name="ViewSymptomImage" component={ViewSymptomImage} />
          <Stack.Screen name="EditSymptomImage" component={EditSymptomImage} />
          <Stack.Screen name="AddPastImage" component={AddPastImage} />
          <Stack.Screen name="ViewPastImage" component={ViewPastImage} />
          <Stack.Screen name="EditPastImage" component={EditPastImage} />
          <Stack.Screen name="AddTestResult" component={AddTestResult} />
          <Stack.Screen name="ViewTest" component={ViewTest} />
          <Stack.Screen name="NurseEditTest" component={NurseEditTest} />
          <Stack.Screen name="AddTestImage" component={AddTestImage} />
          <Stack.Screen name="ViewTestImage" component={ViewTestImage} />
          <Stack.Screen name="EditTestImage" component={EditTestImage} />
        </Stack.Navigator>
      </EmailProvider>
    </NavigationContainer>
  );
};

export default App;
