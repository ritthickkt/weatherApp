import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { fetchWeatherApi } from 'openmeteo';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    'NewFont': require('../assets/fonts/Sigmar-Regular.ttf'),
  });
  const [weather, setWeather] = useState<{ time: Date; temperature2m: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      const params = {
        latitude:  -33.907715,
        longitude: 151.235559,
        current: 'temperature_2m',
      };
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const current = response.current();
      setWeather({
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0).value(),
      });
      setLoading(false);
    };
    fetchWeather();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading || !weather ? (
        <ActivityIndicator color="black" />
      ) : (
        <>
          <Text style={styles.text}>{weather.time.toString()}</Text>
            <Text style={styles.temperature}>{weather.temperature2m.toFixed(0)}°C</Text>
        </>
      )}
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
  },
  temperature: {
    fontSize: 80,
    fontFamily: 'NewFont',
    color: 'white',
  }
});
