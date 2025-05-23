import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, SafeAreaView, BackHandler } from 'react-native';
import { fetchWeatherApi } from 'openmeteo';
import { router, useLocalSearchParams } from 'expo-router';

export default function LocationScreen() {
  const {cityName, latitude, longitude } = useLocalSearchParams();

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ time: Date; temperature2m: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cityName && latitude && longitude) {
      getWeather(cityName as string);
    }
  }, [cityName, latitude, longitude]);

  const getWeather = async (cityName: string) => {
    setSelectedCity(cityName);
    setLoading(true);
    setWeather(null);
    const params = {
      latitude: latitude,
      longitude: longitude,
      current: 'temperature_2m',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    // console.log('Weather API Response:', responses);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    setWeather({
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0).value(),
    });
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginVertical: 20 }}>
            <Text style={styles.buttonText}>{selectedCity}</Text>
      </View>
      {loading && <ActivityIndicator color="white" />}
      {weather && (
        <View>
          <Text style={styles.text}>{weather.time.toDateString()}</Text>
          <Text style={styles.temperature}>{weather.temperature2m.toFixed(0)}°C</Text>
        </View>
      )}
      <View style={styles.backButtonContainer}>
        <Pressable
            onPress={() => router.push('../welcome')}
          >
            <Text style={styles.backButton}>Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  temperature: {
    fontSize: 48,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
    overflow: 'hidden',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
});