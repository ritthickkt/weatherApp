import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import entryScreen from './entryScreen';
import { router, usePathname } from 'expo-router';

export default function LocationScreen() {
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
        style={styles.text}
        placeholder="City name"
        value={cityName}
        onChangeText={setCityName}
      />
      <Button title="Search" onPress={handleSearch} />
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
    color: 'white',
    fontSize: 24,
  }
}); 