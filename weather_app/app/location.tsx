import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter your location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 24,
  }
}); 