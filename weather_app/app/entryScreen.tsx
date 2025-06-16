import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, SafeAreaView, BackHandler, Animated } from 'react-native';
import { fetchWeatherApi } from 'openmeteo';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={[
        'rgba(2, 0, 36, 1)',       
        'rgba(9, 9, 121, 1)',      
        'rgba(0, 212, 255, 1)'     
      ]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
        <View style={styles.cityName}>
              <Text style={styles.buttonText}>{selectedCity}</Text>
        </View>
        {loading && <ActivityIndicator color="white" />}
        {weather && (
          <View>
            <Text style={styles.temperature}>{weather.temperature2m.toFixed(0)}</Text>
            <Text style={styles.text}>{weather.time.toDateString()}</Text>
          </View>
        )}
        <View style={styles.backButtonContainer}>
          <Pressable
              onPress={() => router.push('/')}
              >
              <Text style={styles.backButton}>Back</Text>
          </Pressable>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cityName: {
    position: 'absolute',
    top: 70,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 25,
  },
  temperature: {
    fontSize: 120,
    fontWeight: 'bold',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: -785,
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
});