import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading Details</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
 
    loadingText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#6B46C1', 
      textTransform: 'uppercase', 
      letterSpacing: 1, 
      textAlign: 'center', 
      textShadowColor: '#000', 
      textShadowOffset: { width: 1, height: 1 }, 
      textShadowRadius: 2, 
    },
});
export default LoadingScreen;
