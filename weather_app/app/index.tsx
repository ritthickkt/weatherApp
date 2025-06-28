import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import entryScreen from './entryScreen';
import { router, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';

export default function LocationScreen() {
  const [fontsLoaded] = useFonts({
    MyFont: require('../assets/fonts/Quicksand-VariableFont_wght.ttf'), 
  });

  const [cityName, setCityName] = useState('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getCoordinates(cityName: string) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { latitude, longitude } = data.results[0];
      router.push({
        pathname: '/entryScreen',
        params: { cityName, latitude, longitude },
      })
    } else {
      throw new Error('City not found');
    }
  }

  async function handleSearch() {
    setError(null);
    setCoordinates(null);
    try {
      const coords = await getCoordinates(cityName);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter your location</Text>
      <TextInput
        style={styles.textInput}
        placeholder="City name"
        value={cityName}
        onChangeText={setCityName}
      />
      <Pressable
      onPress={handleSearch}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonGlow
      ]}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
      {coordinates && (
        <Text>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </Text>
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
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
    fontFamily: 'MyFont',
    color: 'white',
    fontSize: 40,
  },
  textInput: {
    fontFamily: 'MyFont',
    borderRadius: 10,
    color: 'white',
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    margin: 50,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    paddingRight: 40,
    paddingLeft: 40,
    borderRadius: 50,
    alignItems: 'center',
    // Default shadow (iOS)
    shadowColor: '#00f6ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    // Default elevation (Android)
    elevation: 2,
  },
  buttonGlow: {
    // Glow effect on press
    shadowColor: '#00f6ff',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    fontFamily: 'MyFont',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});